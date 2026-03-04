import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { exportUniversityData, exportAllAdmissionStats, exportFullReport } from '@/lib/export/dataExport';
import { toast } from 'sonner';

type ExportFormat = 'csv' | 'xlsx';

interface UniversityExportButtonProps {
  universityName: string;
  admissionStats: any[];
  specialties: any[];
  faculties: any[];
  className?: string;
}

export function UniversityExportButton({ 
  universityName, 
  admissionStats, 
  specialties, 
  faculties,
  className 
}: UniversityExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      exportUniversityData(universityName, admissionStats, specialties, faculties, format);
      toast.success(`Данные экспортированы в ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Ошибка при экспорте данных');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className} disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          Экспорт
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{universityName}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="w-4 h-4 mr-2" />
          CSV (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AdmissionExportButtonProps {
  admissionStats: any[];
  className?: string;
}

export function AdmissionExportButton({ admissionStats, className }: AdmissionExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      exportAllAdmissionStats(admissionStats, format);
      toast.success(`Данные экспортированы в ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Ошибка при экспорте данных');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className} disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          Экспорт
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Статистика поступления</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="w-4 h-4 mr-2" />
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          setIsExporting(true);
          try {
            exportFullReport('xlsx');
            toast.success('Полный отчёт экспортирован');
          } catch (error) {
            toast.error('Ошибка при экспорте');
          } finally {
            setIsExporting(false);
          }
        }}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Полный отчёт (все данные)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
