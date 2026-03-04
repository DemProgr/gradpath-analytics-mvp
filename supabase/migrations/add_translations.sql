-- Add translation fields to universities table
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS short_name_en TEXT,
ADD COLUMN IF NOT EXISTS short_name_be TEXT,
ADD COLUMN IF NOT EXISTS full_name_en TEXT,
ADD COLUMN IF NOT EXISTS full_name_be TEXT;

-- Add translation fields to faculties table
ALTER TABLE faculties 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS name_be TEXT;

-- Update universities with English translations
UPDATE universities SET short_name_en = 'BSU', full_name_en = 'Belarusian State University' WHERE short_name = 'БГУ';
UPDATE universities SET short_name_en = 'BSUT', full_name_en = 'Belarusian State Technological University' WHERE short_name = 'БНТУ';
UPDATE universities SET short_name_en = 'BSUIR', full_name_en = 'Belarusian State University of Informatics and Radioelectronics' WHERE short_name = 'БГУИР';
UPDATE universities SET short_name_en = 'BSMU', full_name_en = 'Belarusian State Medical University' WHERE short_name = 'БГМУ';
UPDATE universities SET short_name_en = 'BSULaw', full_name_en = 'Belarusian State University of Law' WHERE short_name = 'БГУ';
UPDATE universities SET short_name_en = 'MSLU', full_name_en = 'Minsk State Linguistic University' WHERE short_name = 'МГЛУ';
UPDATE universities SET short_name_en = 'BSEU', full_name_en = 'Belarusian State Economic University' WHERE short_name = 'БГЭУ';
UPDATE universities SET short_name_en = 'BSPU', full_name_en = 'Belarusian State Pedagogical University' WHERE short_name = 'БГПУ';
UPDATE universities SET short_name_en = 'BSUCA', full_name_en = 'Belarusian State University of Culture and Arts' WHERE short_name = 'БГУКИ';
UPDATE universities SET short_name_en = 'BSUPC', full_name_en = 'Belarusian State University of Physical Culture' WHERE short_name = 'БГУФК';
UPDATE universities SET short_name_en = 'GSU', full_name_en = 'Gomel State University' WHERE short_name = 'ГГУ';
UPDATE universities SET short_name_en = 'GrSU', full_name_en = 'Yanka Kupala Grodno State University' WHERE short_name = 'ГрГУ';
UPDATE universities SET short_name_en = 'BrSTU', full_name_en = 'Brest State Technical University' WHERE short_name = 'БрГТУ';
UPDATE universities SET short_name_en = 'VSU', full_name_en = 'Vitebsk State University' WHERE short_name = 'ВГУ';
UPDATE universities SET short_name_en = 'MSU', full_name_en = 'Mogilev State University' WHERE short_name = 'МГУ';
UPDATE universities SET short_name_en = 'PSU', full_name_en = 'Polotsk State University' WHERE short_name = 'ПГУ';
UPDATE universities SET short_name_en = 'MSPU', full_name_en = 'Mozyr State Pedagogical University' WHERE short_name = 'МГПУ';
UPDATE universities SET short_name_en = 'AIAM', full_name_en = 'Academy of the Interior Ministry' WHERE short_name = 'Академия МВД';

-- Update universities with Belarusian translations
UPDATE universities SET short_name_be = 'БДУ', full_name_be = 'Беларускі дзяржаўны ѡніверсітэт' WHERE short_name = 'БГУ';
UPDATE universities SET short_name_be = 'БНТУ', full_name_be = 'Беларускі дзяржаўны тэхналагічны ѡніверсітэт' WHERE short_name = 'БНТУ';
UPDATE universities SET short_name_be = 'БГУІР', full_name_be = 'Беларускі дзяржаўны ѡніверсітэт інфарматыкі і радыёэлектронікі' WHERE short_name = 'БГУИР';
UPDATE universities SET short_name_be = 'БГМУ', full_name_be = 'Беларускі дзяржаўны медыцынскі ѡніверсітэт' WHERE short_name = 'БГМУ';
UPDATE universities SET short_name_be = 'БДУПА', full_name_be = 'Беларускі дзяржаўны ѡніверсітэт правазнаўства' WHERE short_name = 'БГУ';
UPDATE universities SET short_name_be = 'МДЛУ', full_name_be = 'Мінскі дзяржаўны лінгвістычны ѡніверсітэт' WHERE short_name = 'МГЛУ';
UPDATE universities SET short_name_be = 'БГЭУ', full_name_be = 'Беларускі дзяржаўны эканамічны ѡніверсітэт' WHERE short_name = 'БГЭУ';
UPDATE universities SET short_name_be = 'БГПУ', full_name_be = 'Беларускі дзяржаўны педагагічны ѡніверсітэт' WHERE short_name = 'БГПУ';
UPDATE universities SET short_name_be = 'БГУКІ', full_name_be = 'Беларускі дзяржаўны ѡніверсітэт культуры і мастацтваў' WHERE short_name = 'БГУКИ';
UPDATE universities SET short_name_be = 'БГУФК', full_name_be = 'Беларускі дзяржаўны ѡніверсітэт фізічнай культуры' WHERE short_name = 'БГУФК';
UPDATE universities SET short_name_be = 'ГДУ', full_name_be = 'Гомельскі дзяржаўны ѡніверсітэт' WHERE short_name = 'ГГУ';
UPDATE universities SET short_name_be = 'ГрДУ', full_name_be = 'Гродзенскі дзяржаўны ѡніверсітэт імя Янкі Купалы' WHERE short_name = 'ГрГУ';
UPDATE universities SET short_name_be = 'БрДТУ', full_name_be = 'Брэсцкі дзяржаўны тэхнічны ѡніверсітэт' WHERE short_name = 'БрГТУ';
UPDATE universities SET short_name_be = 'ВДУ', full_name_be = 'Віцебскі дзяржаўны ѡніверсітэт' WHERE short_name = 'ВГУ';
UPDATE universities SET short_name_be = 'МДУ', full_name_be = 'Магілёўскі дзяржаўны ѡніверсітэт' WHERE short_name = 'МГУ';
UPDATE universities SET short_name_be = 'ПДУ', full_name_be = 'Полацкі дзяржаўны ѡніверсітэт' WHERE short_name = 'ПГУ';
UPDATE universities SET short_name_be = 'МДПУ', full_name_be = 'Мазырскі дзяржаўны педагагічны ѡніверсітэт' WHERE short_name = 'МГПУ';
UPDATE universities SET short_name_be = 'АМУД', full_name_be = 'Акадэмія ѡнутраных спраў' WHERE short_name = 'Академия МВД';
