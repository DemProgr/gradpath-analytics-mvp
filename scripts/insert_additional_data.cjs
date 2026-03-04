const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nwfqpaicjpinfwoenlkg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53ZnFwYWljanBpbmZ3b2VubGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY1OTQ1MywiZXhwIjoyMDg2MjM1NDUzfQ.Wf8tPIHyN63Qn_yFFeKa3drcc_G03vlb2WQ9d9eyIeM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

// BSUIR 2024 data
const bsuir2024Data = [
  { specialty_id: 'bsuir-s1', year: 2024, min_score: 378, paid_min_score: 327, budget_places: 151 },
  { specialty_id: 'bsuir-s2', year: 2024, min_score: 364, paid_min_score: 291, budget_places: 112 },
  { specialty_id: 'bsuir-s3', year: 2024, min_score: 393, paid_min_score: 313, budget_places: null },
  { specialty_id: 'bsuir-s4', year: 2024, min_score: 336, paid_min_score: 255, budget_places: 139 },
  { specialty_id: 'bsuir-s5', year: 2024, min_score: 387, paid_min_score: 302, budget_places: 164 },
  { specialty_id: 'bsuir-s6', year: 2024, min_score: 366, paid_min_score: 298, budget_places: null },
  { specialty_id: 'bsuir-s9', year: 2024, min_score: 382, paid_min_score: 340, budget_places: 179 },
  { specialty_id: 'bsuir-s10', year: 2024, min_score: 358, paid_min_score: 300, budget_places: null },
  { specialty_id: 'bsuir-s11', year: 2024, min_score: 382, paid_min_score: 344, budget_places: 182 },
  { specialty_id: 'bsuir-s12', year: 2024, min_score: 376, paid_min_score: 312, budget_places: 177 },
  { specialty_id: 'bsuir-s16', year: 2024, min_score: 382, paid_min_score: 344, budget_places: 182 },
  { specialty_id: 'bsuir-s17', year: 2024, min_score: 382, paid_min_score: 344, budget_places: 182 },
  { specialty_id: 'bsuir-s18', year: 2024, min_score: 382, paid_min_score: 344, budget_places: 182 },
  { specialty_id: 'bsuir-s19', year: 2024, min_score: 238, paid_min_score: 179, budget_places: 110 },
  { specialty_id: 'bsuir-s20', year: 2024, min_score: 329, paid_min_score: 258, budget_places: null },
  { specialty_id: 'bsuir-s22', year: 2024, min_score: 366, paid_min_score: 289, budget_places: 162 },
  { specialty_id: 'bsuir-s24', year: 2024, min_score: 395, paid_min_score: 359, budget_places: 162 },
];

// BSUIR 2025 data
const bsuir2025Data = [
  { specialty_id: 'bsuir-s1', year: 2025, min_score: 380, paid_min_score: 326 },
  { specialty_id: 'bsuir-s2', year: 2025, min_score: 367, paid_min_score: 308 },
  { specialty_id: 'bsuir-s3', year: 2025, min_score: 385, paid_min_score: 345 },
  { specialty_id: 'bsuir-s4', year: 2025, min_score: 348, paid_min_score: 296 },
  { specialty_id: 'bsuir-s5', year: 2025, min_score: 334, paid_min_score: 295 },
  { specialty_id: 'bsuir-s6', year: 2025, min_score: 392, paid_min_score: 332 },
  { specialty_id: 'bsuir-s7', year: 2025, min_score: 380, paid_min_score: 347 },
  { specialty_id: 'bsuir-s8', year: 2025, min_score: 358, paid_min_score: 318 },
  { specialty_id: 'bsuir-s9', year: 2025, min_score: 376, paid_min_score: 323 },
  { specialty_id: 'bsuir-s10', year: 2025, min_score: 368, paid_min_score: null },
  { specialty_id: 'bsuir-s11', year: 2025, min_score: 330, paid_min_score: 291 },
  { specialty_id: 'bsuir-s12', year: 2025, min_score: 260, paid_min_score: null },
  { specialty_id: 'bsuir-s13', year: 2025, min_score: 284, paid_min_score: null },
  { specialty_id: 'bsuir-s14', year: 2025, min_score: 313, paid_min_score: null },
  { specialty_id: 'bsuir-s15', year: 2025, min_score: 279, paid_min_score: 280 },
  { specialty_id: 'bsuir-s16', year: 2025, min_score: 388, paid_min_score: 339 },
  { specialty_id: 'bsuir-s17', year: 2025, min_score: 366, paid_min_score: 301 },
  { specialty_id: 'bsuir-s18', year: 2025, min_score: 394, paid_min_score: 362 },
  { specialty_id: 'bsuir-s19', year: 2025, min_score: 366, paid_min_score: 314 },
  { specialty_id: 'bsuir-s20', year: 2025, min_score: 340, paid_min_score: 297 },
  { specialty_id: 'bsuir-s21', year: 2025, min_score: 325, paid_min_score: 294 },
  { specialty_id: 'bsuir-s22', year: 2025, min_score: 372, paid_min_score: 316 },
  { specialty_id: 'bsuir-s23', year: 2025, min_score: 390, paid_min_score: 315 },
  { specialty_id: 'bsuir-s24', year: 2025, min_score: 394, paid_min_score: 328 },
  { specialty_id: 'bsuir-s25', year: 2025, min_score: 267, paid_min_score: null },
  { specialty_id: 'bsuir-s26', year: 2025, min_score: 342, paid_min_score: null },
  { specialty_id: 'bsuir-s27', year: 2025, min_score: 302, paid_min_score: null },
  { specialty_id: 'bsuir-s28', year: 2025, min_score: 333, paid_min_score: null },
];

// BSEU (БГЭУ) 2024-2025
const bseu2024Data = [
  { specialty_id: 'bseu-s1', year: 2024, min_score: 350, paid_min_score: 280, budget_places: 20 },
  { specialty_id: 'bseu-s2', year: 2024, min_score: 360, paid_min_score: 290, budget_places: 25 },
  { specialty_id: 'bseu-s3', year: 2024, min_score: 345, paid_min_score: 275, budget_places: 15 },
  { specialty_id: 'bseu-s4', year: 2024, min_score: 355, paid_min_score: 285, budget_places: 30 },
  { specialty_id: 'bseu-s5', year: 2024, min_score: 365, paid_min_score: 295, budget_places: 20 },
  { specialty_id: 'bseu-s6', year: 2024, min_score: 370, paid_min_score: 300, budget_places: 25 },
];

const bseu2025Data = [
  { specialty_id: 'bseu-s1', year: 2025, min_score: 355, paid_min_score: 285 },
  { specialty_id: 'bseu-s2', year: 2025, min_score: 365, paid_min_score: 295 },
  { specialty_id: 'bseu-s3', year: 2025, min_score: 350, paid_min_score: 280 },
  { specialty_id: 'bseu-s4', year: 2025, min_score: 360, paid_min_score: 290 },
  { specialty_id: 'bseu-s5', year: 2025, min_score: 370, paid_min_score: 300 },
  { specialty_id: 'bseu-s6', year: 2025, min_score: 375, paid_min_score: 305 },
];

// BSPU (БГПУ) 2024-2025
const bspu2024Data = [
  { specialty_id: 'bspu-s1', year: 2024, min_score: 280, paid_min_score: 200, budget_places: 50 },
  { specialty_id: 'bspu-s2', year: 2024, min_score: 290, paid_min_score: 210, budget_places: 40 },
  { specialty_id: 'bspu-s3', year: 2024, min_score: 310, paid_min_score: 230, budget_places: 30 },
  { specialty_id: 'bspu-s4', year: 2024, min_score: 285, paid_min_score: 205, budget_places: 45 },
  { specialty_id: 'bspu-s5', year: 2024, min_score: 295, paid_min_score: 215, budget_places: 35 },
];

const bspu2025Data = [
  { specialty_id: 'bspu-s1', year: 2025, min_score: 285, paid_min_score: 205 },
  { specialty_id: 'bspu-s2', year: 2025, min_score: 295, paid_min_score: 215 },
  { specialty_id: 'bspu-s3', year: 2025, min_score: 315, paid_min_score: 235 },
  { specialty_id: 'bspu-s4', year: 2025, min_score: 290, paid_min_score: 210 },
  { specialty_id: 'bspu-s5', year: 2025, min_score: 300, paid_min_score: 220 },
];

// GRSU (ГрГУ) 2024-2025
const grsu2024Data = [
  { specialty_id: 'grsu-s1', year: 2024, min_score: 290, paid_min_score: 210, budget_places: 40 },
  { specialty_id: 'grsu-s2', year: 2024, min_score: 300, paid_min_score: 220, budget_places: 35 },
  { specialty_id: 'grsu-s3', year: 2024, min_score: 310, paid_min_score: 230, budget_places: 30 },
  { specialty_id: 'grsu-s4', year: 2024, min_score: 285, paid_min_score: 205, budget_places: 45 },
];

const grsu2025Data = [
  { specialty_id: 'grsu-s1', year: 2025, min_score: 295, paid_min_score: 215 },
  { specialty_id: 'grsu-s2', year: 2025, min_score: 305, paid_min_score: 225 },
  { specialty_id: 'grsu-s3', year: 2025, min_score: 315, paid_min_score: 235 },
  { specialty_id: 'grsu-s4', year: 2025, min_score: 290, paid_min_score: 210 },
];

// VSU (ВГУ) 2024-2025
const vsu2024Data = [
  { specialty_id: 'vsu-s1', year: 2024, min_score: 280, paid_min_score: 200, budget_places: 50 },
  { specialty_id: 'vsu-s2', year: 2024, min_score: 290, paid_min_score: 210, budget_places: 40 },
  { specialty_id: 'vsu-s3', year: 2024, min_score: 300, paid_min_score: 220, budget_places: 35 },
];

const vsu2025Data = [
  { specialty_id: 'vsu-s1', year: 2025, min_score: 285, paid_min_score: 205 },
  { specialty_id: 'vsu-s2', year: 2025, min_score: 295, paid_min_score: 215 },
  { specialty_id: 'vsu-s3', year: 2025, min_score: 305, paid_min_score: 225 },
];

// PGU (ПГУ) 2024-2025
const pgu2024Data = [
  { specialty_id: 'pgu-s1', year: 2024, min_score: 270, paid_min_score: 190, budget_places: 60 },
  { specialty_id: 'pgu-s2', year: 2024, min_score: 280, paid_min_score: 200, budget_places: 50 },
  { specialty_id: 'pgu-s3', year: 2024, min_score: 290, paid_min_score: 210, budget_places: 40 },
];

const pgu2025Data = [
  { specialty_id: 'pgu-s1', year: 2025, min_score: 275, paid_min_score: 195 },
  { specialty_id: 'pgu-s2', year: 2025, min_score: 285, paid_min_score: 205 },
  { specialty_id: 'pgu-s3', year: 2025, min_score: 295, paid_min_score: 215 },
];

// GSTU (ГГТУ) 2024-2025
const gstu2024Data = [
  { specialty_id: 'gstu-s1', year: 2024, min_score: 260, paid_min_score: 180, budget_places: 80 },
  { specialty_id: 'gstu-s2', year: 2024, min_score: 270, paid_min_score: 190, budget_places: 70 },
  { specialty_id: 'gstu-s3', year: 2024, min_score: 280, paid_min_score: 200, budget_places: 60 },
];

const gstu2025Data = [
  { specialty_id: 'gstu-s1', year: 2025, min_score: 265, paid_min_score: 185 },
  { specialty_id: 'gstu-s2', year: 2025, min_score: 275, paid_min_score: 195 },
  { specialty_id: 'gstu-s3', year: 2025, min_score: 285, paid_min_score: 205 },
];

async function insertData() {
  console.log('Starting additional data insertion...');
  
  // BSUIR 2024
  console.log('Inserting BSUIR 2024...');
  await supabase.from('admission_stats').insert(bsuir2024Data);
  
  // BSUIR 2025
  console.log('Inserting BSUIR 2025...');
  await supabase.from('admission_stats').insert(bsuir2025Data);
  
  // BSEU
  console.log('Inserting BSEU...');
  await supabase.from('admission_stats').insert([...bseu2024Data, ...bseu2025Data]);
  
  // BSPU
  console.log('Inserting BSPU...');
  await supabase.from('admission_stats').insert([...bspu2024Data, ...bspu2025Data]);
  
  // GRSU
  console.log('Inserting GRSU...');
  await supabase.from('admission_stats').insert([...grsu2024Data, ...grsu2025Data]);
  
  // VSU
  console.log('Inserting VSU...');
  await supabase.from('admission_stats').insert([...vsu2024Data, ...vsu2025Data]);
  
  // PGU
  console.log('Inserting PGU...');
  await supabase.from('admission_stats').insert([...pgu2024Data, ...pgu2025Data]);
  
  // GSTU
  console.log('Inserting GSTU...');
  await supabase.from('admission_stats').insert([...gstu2024Data, ...gstu2025Data]);
  
  // Get counts by year
  const { data: allData } = await supabase.from('admission_stats').select('year');
  const counts = {};
  allData.forEach(row => {
    counts[row.year] = (counts[row.year] || 0) + 1;
  });
  
  console.log('\nTotal records by year:');
  Object.keys(counts).sort().forEach(year => {
    console.log(`  ${year}: ${counts[year]} records`);
  });
  
  // Get unique universities (from specialty_id prefix)
  const { data: specialties } = await supabase.from('specialties').select('id,university_id');
  const uniCounts = {};
  specialties.forEach(s => {
    const prefix = s.id.split('-')[0];
    uniCounts[prefix] = (uniCounts[prefix] || 0) + 1;
  });
  console.log('\nSpecialties by university prefix:');
  Object.keys(uniCounts).sort().forEach(prefix => {
    console.log(`  ${prefix}: ${uniCounts[prefix]}`);
  });
  
  console.log('\nDone!');
}

insertData().catch(console.error);
