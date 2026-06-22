import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // PSU - check if it exists in DB
  const psu = await sql`SELECT id, short_name, full_name FROM universities WHERE id ILIKE '%psu%' OR short_name ILIKE '%полоц%'`;
  console.log('PSU in DB:', psu.length);
  psu.forEach((u: any) => console.log(`  ${u.id} - ${u.short_name} - ${u.full_name}`));
  
  // All universities that have faculties
  const uniWithFac = await sql`SELECT DISTINCT u.id, u.short_name FROM universities u INNER JOIN faculties f ON f.university_id = u.id ORDER BY u.short_name`;
  console.log('\nUNIVERSITIES WITH FACULTIES IN DB:');
  uniWithFac.forEach((u: any) => console.log(`  ${u.id} - ${u.short_name}`));
  
  // BSU specialties: total vs by faculty
  const bsuTotal = await sql`SELECT COUNT(*)::int as cnt FROM specialties WHERE university_id = 'bsu'`;
  console.log(`\nBSU total specialties: ${bsuTotal[0].cnt}`);
  
  const bsuByFac = await sql`SELECT faculty_id, COUNT(*)::int as cnt FROM specialties WHERE university_id = 'bsu' AND faculty_id IS NOT NULL GROUP BY faculty_id ORDER BY faculty_id`;
  console.log('BSU specialties by faculty:');
  bsuByFac.forEach((s: any) => console.log(`  ${s.faculty_id}: ${s.cnt} specialties`));
  
  // Test the exact query the API would do for BSU + faculty bsu-3
  const testQuery = await sql`SELECT id, name FROM specialties WHERE university_id = 'bsu' AND faculty_id = 'bsu-3' ORDER BY name`;
  console.log('\nAPI query: specialties WHERE university_id=bsu AND faculty_id=bsu-3:');
  testQuery.forEach((s: any) => console.log(`  ${s.id} - ${s.name}`));
  
  process.exit(0);
}
main().catch((err: any) => { console.error(err); process.exit(1); });
