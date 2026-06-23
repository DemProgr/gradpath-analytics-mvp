import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Target, Award, MapPin, Banknote, DollarSign, Users, Shield, BookOpen, Calendar, BarChart, Star } from 'lucide-react';

interface ProfessionDetailsProps {
  profession: {
    title: string;
    category: string;
    description: string;
    careerPath: string;
    keySkills: string[];
    improvementAreas: string[];
    education: string[];
    salary: {
      average: number;
      range: string;
      growth: string;
    };
    prospects: string;
    relevance: string;
    marketDemand: string;
    location: string;
  };
}

export function ProfessionDetails({ profession }: ProfessionDetailsProps) {
  const formatSalary = (salary: number) => salary.toLocaleString() + ' BYN';

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {profession.title}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-sm">
                {profession.category}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {profession.marketDemand}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm font-medium">
              <DollarSign className="w-4 h-4 mr-1" />
              {formatSalary(profession.salary.average)}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {profession.salary.growth}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="font-semibold text-foreground mb-3">
            <Briefcase className="w-5 h-5 mr-2 inline" />
            Описание профессии
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {profession.description}
          </p>
        </motion.div>

        {/* Career Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="font-semibold text-foreground mb-3">
            <Target className="w-5 h-5 mr-2 inline" />
            Карьерный путь
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {profession.careerPath}
          </p>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="font-semibold text-foreground mb-3">
            <Target className="w-5 h-5 mr-2 inline" />
            Ключевые навыки
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {profession.keySkills.map((skill, index) => (
              <Badge key={skill} variant="outline" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Improvement Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="font-semibold text-foreground mb-3">
            <Target className="w-5 h-5 mr-2 inline" />
            Что улучшить
          </h3>
          <div className="space-y-2">
            {profession.improvementAreas.map((area, index) => (
              <div key={'area-' + index} className="flex items-start gap-2">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-muted-foreground">{area}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="font-semibold text-foreground mb-3">
            <BookOpen className="w-5 h-5 mr-2 inline" />
            Где учиться
          </h3>
          <div className="space-y-2">
            {profession.education.map((edu, index) => (
              <div key={'edu-' + index} className="flex items-start gap-2">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-muted-foreground">{edu}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Salary Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="font-semibold text-foreground mb-3">
            <Banknote className="w-5 h-5 mr-2 inline" />
            Зарплата и компенсации
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-1">Средняя зарплата</p>
              <p className="text-2xl font-bold text-primary">{formatSalary(profession.salary.average)}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-1">Диапазон</p>
              <p className="text-lg font-medium text-foreground">{profession.salary.range}</p>
            </div>
          </div>
        </motion.div>

        {/* Prospects and Relevance */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-foreground">Перспективы</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profession.prospects}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-400" />
              <h4 className="font-semibold text-foreground">Актуальность</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profession.relevance}
            </p>
          </motion.div>
        </div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-border"
        >
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">География работы:</span>
            <span>{profession.location}</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}