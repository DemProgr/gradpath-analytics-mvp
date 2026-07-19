// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Code, Palette, TrendingUp, Brain, Users, Stethoscope, Calculator, Briefcase, BookOpen, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Skill {
  name: string;
  level: number;
  category: 'hard' | 'soft';
}

interface ProfessionSkills {
  profession: string;
  category: string;
  hardSkills: Skill[];
  softSkills: Skill[];
  certifications: string[];
  courses: { name: string; provider: string; duration: string }[];
}

// ⚠️ МОК-ДАННЫЕ: загружать из БД
const professionsData: ProfessionSkills[] = [
  {
    profession: "⚠️ МОК-ДАННЫЕ: загрузить профессию",
    category: "⚠️ МОК-ДАННЫЕ: загрузить категорию",
    hardSkills: [
      { name: "⚠️ МОК-ДАННЫЕ: hard skill", level: 0, category: 'hard' },
    ],
    softSkills: [
      { name: "⚠️ МОК-ДАННЫЕ: soft skill", level: 0, category: 'soft' },
    ],
    certifications: ["⚠️ МОК-ДАННЫЕ: сертификация"],
    courses: [
      { name: "⚠️ МОК-ДАННЫЕ: курс", provider: "⚠️ МОК-ДАННЫЕ: провайдер", duration: "⚠️ МОК-ДАННЫЕ: длительность" },
    ],
  },
];

interface SkillsByProfessionSectionProps {
  className?: string;
}

export function SkillsByProfessionSection({ className }: SkillsByProfessionSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<ProfessionSkills | null>(professionsData[0]);

  const filteredProfessions = professionsData.filter(p => 
    p.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={cn("py-16 bg-card", className)}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              Навыки по профессиям
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Узнайте, какиеHard и Soft навыки, сертификации и курсы нужны для успешной карьеры в вашей сфере.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profession List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск профессии..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredProfessions.map((profession) => (
                <button
                  key={profession.profession}
                  onClick={() => setSelectedProfession(profession)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all",
                    selectedProfession?.profession === profession.profession
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  )}
                >
                  <p className="font-medium">{profession.profession}</p>
                  <p className={cn(
                    "text-sm",
                    selectedProfession?.profession === profession.profession
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}>
                    {profession.category}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Skills Details */}
          <div className="lg:col-span-2">
            {selectedProfession && (
              <motion.div
                key={selectedProfession.profession}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedProfession.profession}
                      <Badge variant="outline">{selectedProfession.category}</Badge>
                    </CardTitle>
                    <CardDescription>
                      Необходимые навыки и рекомендуемые курсы
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Hard Skills */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary" />
                        Hard Skills (профессиональные)
                      </h4>
                      <div className="space-y-3">
                        {selectedProfession.hardSkills.map((skill) => (
                          <div key={skill.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{skill.name}</span>
                              <span className="text-muted-foreground">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Soft Skills */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Soft Skills (мягкие навыки)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfession.softSkills.map((skill) => (
                          <Badge key={skill.name} variant="secondary" className="py-1.5">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Рекомендуемые сертификации
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfession.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="py-1.5">
                            <Check className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Courses */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        Рекомендуемые курсы
                      </h4>
                      <div className="space-y-2">
                        {selectedProfession.courses.map((course) => (
                          <div key={course.name} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                            <div>
                              <p className="font-medium">{course.name}</p>
                              <p className="text-sm text-muted-foreground">{course.provider}</p>
                            </div>
                            <Badge variant="outline">{course.duration}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
