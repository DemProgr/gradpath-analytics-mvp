import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { ArrowUpDown, Search, Loader2, GraduationCap, Users, TrendingUp, Download, FileSpreadsheet } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { exportToCSV, exportToExcel } from '@/utils/exportUtils';
import { CT_REQUIREMENTS, getSubjectNameById, type SpecialtyRequirement } from '@/data/ctSubjects';

interface AdmissionData {
  id: string;
  specialty_id: string;
  year: number;
  min_score: number | null;
  avg_score: number | null;
  budget_places: number | null;
  paid_places: number | null;
  applications_count: number | null;
  enrolled_count: number | null;
  specialty?: {
    name: string;
    code: string | null;
    faculty_id: string | null;
    faculties?: {
      name: string;
      universities?: {
        short_name: string;
        city: string;
      };
    };
  };
}

interface CombinedSpecialty extends SpecialtyRequirement {
  admissionData?: AdmissionData;
}

type SortField = 'university' | 'specialty' | 'minScore' | 'budget' | 'paid' | 'applications';
type SortOrder = 'asc' | 'desc';

export function AdmissionTable() {
  const [admissionData, setAdmissionData] = useState<AdmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUniversity, setFilterUniversity] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('minScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    fetchAdmissionData();
  }, []);

  const fetchAdmissionData = async () => {
    try {
      const { data, error } = await supabase
        .from('admission_stats')
        .select(`
          *,
          specialties:specialty_id (
            name,
            code,
            faculty_id,
            faculties:faculty_id (
              name,
              universities:university_id (
                short_name,
                city
              )
            )
          )
        `)
        .eq('year', 2025)
        .order('min_score', { ascending: false });

      if (data) {
        setAdmissionData(data);
      }
    } catch (error) {
      console.error('Error fetching admission data:', error);
    } finally {
      setLoading(false);
    }
  };

  const combinedData = useMemo(() => {
    return CT_REQUIREMENTS.map(req => {
      const admission = admissionData.find(a => 
        a.specialty?.name?.toLowerCase().includes(req.specialtyName.toLowerCase()) ||
        req.specialtyName.toLowerCase().includes(a.specialty?.name?.toLowerCase() || '')
      );
      
      return {
        ...req,
        admissionData: admission,
      };
    });
  }, [admissionData]);

  const filteredData = useMemo(() => {
    let result = combinedData;

    if (filterUniversity !== 'all') {
      result = result.filter(d => d.universityShortName === filterUniversity);
    }

    if (filterCity !== 'all') {
      result = result.filter(d => {
        const uni = ['БГУ', 'БГУИР', 'БГЭУ', 'БГПУ', 'БГМУ', 'БНТУ', 'БГУИЯ'].includes(d.universityShortName) 
          ? 'Минск' 
          : d.universityShortName === 'ГрГУ' ? 'Гродно' : d.universityShortName === 'ВГУ' ? 'Витебск' : 'other';
        return uni === filterCity;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.specialtyName.toLowerCase().includes(query) ||
        d.universityShortName.toLowerCase().includes(query) ||
        d.facultyName.toLowerCase().includes(query)
      );
    }

    return result.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortField) {
        case 'university':
          aVal = a.universityShortName;
          bVal = b.universityShortName;
          break;
        case 'specialty':
          aVal = a.specialtyName;
          bVal = b.specialtyName;
          break;
        case 'minScore':
          aVal = a.admissionData?.min_score || 0;
          bVal = b.admissionData?.min_score || 0;
          break;
        case 'budget':
          aVal = a.admissionData?.budget_places || 0;
          bVal = b.admissionData?.budget_places || 0;
          break;
        case 'paid':
          aVal = a.admissionData?.paid_places || 0;
          bVal = b.admissionData?.paid_places || 0;
          break;
        case 'applications':
          aVal = a.admissionData?.applications_count || 0;
          bVal = b.admissionData?.applications_count || 0;
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortOrder === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });
  }, [combinedData, filterUniversity, filterCity, searchQuery, sortField, sortOrder]);

  const universities = [...new Set(CT_REQUIREMENTS.map(r => r.universityShortName))];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Университет', 'Специальность', 'Факультет', 'Мин. балл', 'Бюджетные места', 'Платные места', 'Город'];
    const rows = filteredData.map(d => [
      d.universityShortName,
      d.specialtyName,
      d.facultyName,
      d.admissionData?.min_score || '',
      d.admissionData?.budget_places || '',
      d.admissionData?.paid_places || '',
      d.universityShortName.includes('БГУ') || d.universityShortName.includes('БНТУ') ? 'Минск' : 'Другой'
    ]);
    exportToCSV(rows, headers, `admission_stats_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportExcel = () => {
    const headers = ['Университет', 'Специальность', 'Факультет', 'Мин. балл', 'Бюджетные места', 'Платные места', 'Город'];
    const rows = filteredData.map(d => [
      d.universityShortName,
      d.specialtyName,
      d.facultyName,
      d.admissionData?.min_score || '',
      d.admissionData?.budget_places || '',
      d.admissionData?.paid_places || '',
      d.universityShortName.includes('БГУ') || d.universityShortName.includes('БНТУ') ? 'Минск' : 'Другой'
    ]);
    exportToExcel(rows, headers, `admission_stats_${new Date().toISOString().split('T')[0]}.xls`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Поиск специальности..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterUniversity} onValueChange={setFilterUniversity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Университет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все университеты</SelectItem>
            {universities.map(uni => (
              <SelectItem key={uni} value={uni}>{uni}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Город" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все города</SelectItem>
            <SelectItem value="Минск">Минск</SelectItem>
            <SelectItem value="Гродно">Гродно</SelectItem>
            <SelectItem value="Витебск">Витебск</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportCSV}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-sm text-muted-foreground">
        Найдено: <span className="font-medium text-foreground">{filteredData.length}</span> специальностей
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent bg-muted/50">
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('university')}
              >
                <div className="flex items-center gap-1">
                  Вуз <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('specialty')}
              >
                <div className="flex items-center gap-1">
                  Специальность <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead>Предметы ЦТ</TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('minScore')}
              >
                <div className="flex items-center justify-end gap-1">
                  Мин. балл <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('budget')}
              >
                <div className="flex items-center justify-end gap-1">
                  Бюджет <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('paid')}
              >
                <div className="flex items-center justify-end gap-1">
                  Платное <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('applications')}
              >
                <div className="flex items-center justify-end gap-1">
                  Заявок <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Нет данных для отображения
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, idx) => (
                <TableRow 
                  key={idx}
                  className="border-border/30 hover:bg-secondary/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="font-medium">
                      {item.universityShortName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[250px]">
                      <p className="font-medium text-sm truncate">{item.specialtyName}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.facultyName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {getSubjectNameById(item.firstSubject)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getSubjectNameById(item.secondSubject)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.admissionData?.min_score ? (
                      <span className="font-semibold">
                        {item.admissionData.min_score}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.admissionData?.budget_places ? (
                      <div className="flex items-center justify-end gap-1">
                        <GraduationCap className="w-3 h-3 text-green-500" />
                        {item.admissionData.budget_places}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.admissionData?.paid_places ? (
                      <div className="flex items-center justify-end gap-1">
                        <Users className="w-3 h-3 text-blue-500" />
                        {item.admissionData.paid_places}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.admissionData?.applications_count ? (
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3 text-orange-500" />
                        {item.admissionData.applications_count}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {admissionData.length === 0 && (
        <div className="text-center py-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            Данные о поступлении загружаются из базы. Пока доступны только требования к предметам ЦТ.
          </p>
        </div>
      )}
    </motion.div>
  );
}
