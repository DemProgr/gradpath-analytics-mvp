import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, GraduationCap, MapPin, BookOpen } from 'lucide-react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('search');

  // ⚠️ МОК-ДАННЫЕ: загружать из БД
  const sampleResults = [
    {
      id: 0,
      type: '⚠️ МОК-ДАННЫЕ: university',
      name: '⚠️ МОК-ДАННЫЕ: название вуза',
      location: '⚠️ МОК-ДАННЫЕ: город',
      description: '⚠️ МОК-ДАННЫЕ: описание',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'university':
        return <GraduationCap className="w-5 h-5" />;
      case 'specialty':
        return <BookOpen className="w-5 h-5" />;
      case 'profession':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="h-32"></div>
      
      <div className="w-full" style={{ backgroundColor: 'rgb(237, 207, 130)' }}>
        <main className="section-container py-24">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-background/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <Search className="w-6 h-6" />
                  Поиск
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Поиск университетов, направлений, профессий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-lg py-6"
                  />
                  <Button className="px-6">Найти</Button>
                </div>

                {searchQuery && (
                  <div className="space-y-3 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Результаты поиска:
                    </p>
                    <div className="space-y-2">
                      {sampleResults.map((result) => (
                        <div
                          key={result.id}
                          className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-primary mt-0.5">
                              {getIcon(result.type)}
                            </div>
                            <div>
                              <p className="font-medium">{result.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {result.description}
                              </p>
                              {'location' in result && result.location && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  {result.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <div className="h-32"></div>

    </div>
  );
};

export default SearchPage;