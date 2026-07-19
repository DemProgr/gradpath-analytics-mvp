// ⚠️ Числовые значения обнулены — заменить на реальные данные из БД
export interface ProfessionSalary {
  id: string;
  profession: string;
  category: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  source: string;
}

export const PROFESSIONS_SALARY: ProfessionSalary[] = [
  // IT и Технологии
  { id: 'it-1', profession: 'Разработчик программного обеспечения', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-2', profession: 'Веб-разработчик', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-3', profession: 'Backend-разработчик', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-4', profession: 'Frontend-разработчик', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-5', profession: 'Fullstack-разработчик', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-6', profession: 'DevOps инженер', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-7', profession: 'Системный администратор', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-8', profession: 'Системный аналитик', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-9', profession: 'QA инженер / Тестировщик', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-10', profession: 'Data Scientist / Аналитик данных', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-11', profession: 'Специалист по кибербезопасности', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-12', profession: 'Инженер по телекоммуникациям', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-13', profession: 'Графический дизайнер', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-14', profession: 'UI/UX дизайнер', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'it-15', profession: 'Product менеджер', category: 'Информационные технологии', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Финансы и Страхование (5664 BYN средняя)
  { id: 'fin-1', profession: 'Финансовый аналитик', category: 'Финансы и страхование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'fin-2', profession: 'Экономист', category: 'Финансы и страхование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'fin-3', profession: 'Бухгалтер', category: 'Финансы и страхование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'fin-4', profession: 'Аудитор', category: 'Финансы и страхование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'fin-5', profession: 'Инвестиционный консультант', category: 'Финансы и страхование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'fin-6', profession: 'Банковский служащий', category: 'Финансы и страхование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'fin-7', profession: 'Страховой агент', category: 'Финансы и страхование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'fin-8', profession: 'Риск-менеджер', category: 'Финансы и страхование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Строительство (3903 BYN средняя)
  { id: 'constr-1', profession: 'Инженер-строитель', category: 'Строительство и архитектура', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'constr-2', profession: 'Прораб', category: 'Строительство и архитектура', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'constr-3', profession: 'Архитектор', category: 'Строительство и архитектура', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'constr-4', profession: 'Сметчик', category: 'Строительство и архитектура', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'constr-5', profession: 'Каменщик', category: 'Строительство и архитектура', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'constr-6', profession: 'Электрик-строитель', category: 'Строительство и архитектура', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'constr-7', profession: 'Сантехник', category: 'Строительство и архитектура', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'constr-8', profession: 'Кровельщик', category: 'Строительство и архитектура', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Промышленность (3285 BYN средняя)
  { id: 'ind-1', profession: 'Инженер-механик', category: 'Промышленность', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'ind-2', profession: 'Инженер-электрик', category: 'Промышленность', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'ind-3', profession: 'Технолог производства', category: 'Промышленность', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'ind-4', profession: 'Оператор станков с ЧПУ', category: 'Промышленность', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'ind-5', profession: 'Сварщик', category: 'Промышленность', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'ind-6', profession: 'Токарь', category: 'Промышленность', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'ind-7', profession: 'Фрезеровщик', category: 'Промышленность', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'ind-8', profession: 'Слесарь', category: 'Промышленность', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Транспорт и логистика (2888 BYN средняя)
  { id: 'trans-1', profession: 'Водитель-международник', category: 'Транспорт и логистика', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trans-2', profession: 'Водитель грузовика', category: 'Транспорт и логистика', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trans-3', profession: 'Водитель автобуса', category: 'Транспорт и логистика', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trans-4', profession: 'Логист', category: 'Транспорт и логистика', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trans-5', profession: 'Складской работник', category: 'Транспорт и логистика', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trans-6', profession: 'Курьер', category: 'Транспорт и логистика', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trans-7', profession: 'Механик-водитель', category: 'Транспорт и логистика', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Торговля (2929 BYN средняя)
  { id: 'trade-1', profession: 'Менеджер по продажам', category: 'Торговля', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trade-2', profession: 'Продавец-консультант', category: 'Торговля', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trade-3', profession: 'Кассир', category: 'Торговля', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trade-4', profession: 'Товаровед', category: 'Торговля', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trade-5', profession: 'Закупщик', category: 'Торговля', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trade-6', profession: 'Маркетолог', category: 'Торговля', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'trade-7', profession: 'Директор магазина', category: 'Торговля', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Медицина (2464 BYN средняя)
  { id: 'med-1', profession: 'Врач-специалист', category: 'Здравоохранение', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'med-2', profession: 'Врач общей практики', category: 'Здравоохранение', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'med-3', profession: 'Хирург', category: 'Здравоохранение', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'med-4', profession: 'Стоматолог', category: 'Здравоохранение', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'med-5', profession: 'Медицинская сестра', category: 'Здравоохранение', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'med-6', profession: 'Фельдшер', category: 'Здравоохранение', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'med-7', profession: 'Фармацевт', category: 'Здравоохранение', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'med-8', profession: 'Лаборант', category: 'Здравоохранение', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Образование (2040 BYN средняя)
  { id: 'edu-1', profession: 'Преподаватель вуза', category: 'Образование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'edu-2', profession: 'Учитель школы', category: 'Образование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'edu-3', profession: 'Воспитатель детского сада', category: 'Образование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'edu-4', profession: 'Репетитор', category: 'Образование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'edu-5', profession: 'Педагог дополнительного образования', category: 'Образование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'edu-6', profession: 'Методист', category: 'Образование', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Сельское хозяйство (2431 BYN средняя)
  { id: 'agr-1', profession: 'Агроном', category: 'Сельское хозяйство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'agr-2', profession: 'Ветеринар', category: 'Сельское хозяйство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'agr-3', profession: 'Механизатор', category: 'Сельское хозяйство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'agr-4', profession: 'Оператор машинного доения', category: 'Сельское хозяйство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'agr-5', profession: 'Зоотехник', category: 'Сельское хозяйство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Юриспруденция
  { id: 'law-1', profession: 'Юрист', category: 'Юриспруденция', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'law-2', profession: 'Адвокат', category: 'Юриспруденция', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'law-3', profession: 'Нотариус', category: 'Юриспруденция', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'law-4', profession: 'Судья', category: 'Юриспруденция', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'law-5', profession: 'Прокурор', category: 'Юриспруденция', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'law-6', profession: 'Следователь', category: 'Юриспруденция', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'law-7', profession: 'Правозащитник', category: 'Юриспруденция', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Маркетинг и PR
  { id: 'mkt-1', profession: 'PR-менеджер', category: 'Маркетинг и PR', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'mkt-2', profession: 'SMM-менеджер', category: 'Маркетинг и PR', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'mkt-3', profession: 'SEO-специалист', category: 'Маркетинг и PR', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'mkt-4', profession: 'Копирайтер', category: 'Маркетинг и PR', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'mkt-5', profession: 'Бренд-менеджер', category: 'Маркетинг и PR', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Гостиницы и рестораны
  { id: 'hotel-1', profession: 'Администратор отеля', category: 'Гостиницы и рестораны', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'hotel-2', profession: 'Повар', category: 'Гостиницы и рестораны', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'hotel-3', profession: 'Шеф-повар', category: 'Гостиницы и рестораны', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'hotel-4', profession: 'Официант', category: 'Гостиницы и рестораны', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'hotel-5', profession: 'Бармен', category: 'Гостиницы и рестораны', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'hotel-6', profession: 'Парикмахер', category: 'Гостиницы и рестораны', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'hotel-7', profession: 'Косметолог', category: 'Гостиницы и рестораны', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Культура и искусство
  { id: 'cult-1', profession: 'Журналист', category: 'Культура и искусство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'cult-2', profession: 'Редактор', category: 'Культура и искусство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'cult-3', profession: 'Переводчик', category: 'Культура и искусство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'cult-4', profession: 'Фотограф', category: 'Культура и искусство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'cult-5', profession: 'Видеооператор', category: 'Культура и искусство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'cult-6', profession: 'Музыкант', category: 'Культура и искусство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'cult-7', profession: 'Актёр', category: 'Культура и искусство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'cult-8', profession: 'Библиотекарь', category: 'Культура и искусство', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Наука
  { id: 'sci-1', profession: 'Научный сотрудник', category: 'Наука', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'sci-2', profession: 'Исследователь', category: 'Наука', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'sci-3', profession: 'Кандидат наук', category: 'Наука', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'sci-4', profession: 'Доктор наук', category: 'Наука', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'sci-5', profession: 'Лаборант', category: 'Наука', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Государственная служба
  { id: 'gov-1', profession: 'Государственный служащий', category: 'Государственная служба', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'gov-2', profession: 'Милиционер', category: 'Государственная служба', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'gov-3', profession: 'МЧС-ник', category: 'Государственная служба', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'gov-4', profession: 'Таможенник', category: 'Государственная служба', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'gov-5', profession: 'Налоговый инспектор', category: 'Государственная служба', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },

  // Другие профессии
  { id: 'other-1', profession: 'HR-менеджер', category: 'Управление персоналом', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'other-2', profession: 'Офис-менеджер', category: 'Администрация', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'other-3', profession: 'Секретарь', category: 'Администрация', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'other-4', profession: 'Охранник', category: 'Охрана', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'other-5', profession: 'Уборщик', category: 'Обслуживание', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'other-6', profession: 'Дворник', category: 'Обслуживание', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'other-7', profession: 'Психолог', category: 'Социальные услуги', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
  { id: 'other-8', profession: 'Социальный работник', category: 'Социальные услуги', minSalary: 0, maxSalary: 0, avgSalary: 0, source: 'myfin' },
];

export const CATEGORIES = [
  { id: 'it', name: 'Информационные технологии', avgSalary: 0, color: 'bg-blue-500' },
  { id: 'fin', name: 'Финансы и страхование', avgSalary: 0, color: 'bg-green-500' },
  { id: 'constr', name: 'Строительство и архитектура', avgSalary: 0, color: 'bg-orange-500' },
  { id: 'ind', name: 'Промышленность', avgSalary: 0, color: 'bg-gray-500' },
  { id: 'trans', name: 'Транспорт и логистика', avgSalary: 0, color: 'bg-yellow-500' },
  { id: 'trade', name: 'Торговля', avgSalary: 0, color: 'bg-purple-500' },
  { id: 'med', name: 'Здравоохранение', avgSalary: 0, color: 'bg-red-500' },
  { id: 'edu', name: 'Образование', avgSalary: 0, color: 'bg-teal-500' },
  { id: 'agr', name: 'Сельское хозяйство', avgSalary: 0, color: 'bg-green-600' },
  { id: 'law', name: 'Юриспруденция', avgSalary: 0, color: 'bg-indigo-500' },
  { id: 'mkt', name: 'Маркетинг и PR', avgSalary: 0, color: 'bg-pink-500' },
  { id: 'hotel', name: 'Гостиницы и рестораны', avgSalary: 0, color: 'bg-amber-500' },
  { id: 'cult', name: 'Культура и искусство', avgSalary: 0, color: 'bg-purple-600' },
  { id: 'sci', name: 'Наука', avgSalary: 0, color: 'bg-cyan-500' },
  { id: 'gov', name: 'Государственная служба', avgSalary: 0, color: 'bg-slate-500' },
];

export function getCategoryById(id: string) {
  return CATEGORIES.find(c => c.id === id);
}

export function getProfessionsByCategory(categoryId: string) {
  return PROFESSIONS_SALARY.filter(p => p.category === CATEGORIES.find(c => c.id === categoryId)?.name);
}
