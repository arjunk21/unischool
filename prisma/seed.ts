import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

const schools = [
  { name:'Delhi Public School, R.K. Puram', type:'K12', boards:['CBSE'], city:'New Delhi', state:'Delhi', pincode:'110022', address:'Sector 4, R.K. Puram, New Delhi', locality:'R.K. Puram', feeMin:80000, feeMax:120000, established:1972, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true, hasTransport:true, hasCCTV:true, hasSmartClass:true, gradesFrom:'KG', gradesTo:'12' },
  { name:"St. Xavier's High School", type:'K12', boards:['ICSE'], city:'Mumbai', state:'Maharashtra', pincode:'400001', address:'Mahapalika Marg, Mumbai', locality:'Fort', feeMin:60000, feeMax:90000, established:1869, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true, hasCCTV:true },
  { name:'National Public School, Koramangala', type:'K12', boards:['CBSE'], city:'Bangalore', state:'Karnataka', pincode:'560034', address:'14 Intermediate Ring Road, Koramangala', locality:'Koramangala', feeMin:70000, feeMax:110000, established:1985, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true, hasSmartClass:true },
  { name:'Hyderabad Public School, Begumpet', type:'K12', boards:['CBSE'], city:'Hyderabad', state:'Telangana', pincode:'500016', address:'Ramakrishna Road, Begumpet', locality:'Begumpet', feeMin:90000, feeMax:140000, established:1923, hasHostel:true, hasLibrary:true, hasScienceLab:true, hasSports:true },
  { name:'The Doon School', type:'K12', boards:['CBSE'], city:'Dehradun', state:'Uttarakhand', pincode:'248001', address:'Mall Road, Dehradun', hasHostel:true, feeMin:700000, feeMax:900000, established:1935, hasLibrary:true, hasScienceLab:true, hasSports:true, hasCanteen:true },
  { name:'La Martiniere for Boys', type:'K12', boards:['ICSE'], city:'Kolkata', state:'West Bengal', pincode:'700019', address:'11 Loudon Street, Kolkata', hasHostel:true, feeMin:80000, feeMax:120000, established:1836, hasLibrary:true, hasScienceLab:true, hasSports:true },
  { name:'Amity International School, Saket', type:'K12', boards:['CBSE'], city:'New Delhi', state:'Delhi', pincode:'110017', address:'Sector 6, Pushp Vihar, Saket', locality:'Saket', feeMin:85000, feeMax:130000, established:1996, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true, hasSmartClass:true, hasTransport:true, hasCCTV:true },
  { name:'GD Goenka World School', type:'K12', boards:['CBSE','CAMBRIDGE'], city:'Gurugram', state:'Haryana', pincode:'122001', address:'Sohna Gurgaon Road, Gurugram', hasHostel:true, feeMin:150000, feeMax:250000, established:2004, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true },
  { name:'Podar International School', type:'K12', boards:['CBSE','IB'], city:'Mumbai', state:'Maharashtra', pincode:'400056', address:'Santacruz West, Mumbai', locality:'Santacruz', feeMin:120000, feeMax:200000, established:1927, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true, hasCCTV:true },
  { name:'Mayo College', type:'K12', boards:['CBSE'], city:'Ajmer', state:'Rajasthan', pincode:'305001', address:'Mayo College Road, Ajmer', hasHostel:true, feeMin:500000, feeMax:700000, established:1875, hasLibrary:true, hasScienceLab:true, hasSports:true },
  { name:"Bishop Cotton Boys' School", type:'K12', boards:['CBSE'], city:'Bangalore', state:'Karnataka', pincode:'560025', address:'St. Marks Road, Bangalore', hasHostel:true, feeMin:200000, feeMax:350000, established:1865, hasLibrary:true, hasScienceLab:true, hasSports:true },
  { name:'Springdales School, Pusa Road', type:'K12', boards:['CBSE'], city:'New Delhi', state:'Delhi', pincode:'110060', address:'Pusa Road, New Delhi', feeMin:55000, feeMax:85000, established:1955, hasLibrary:true, hasScienceLab:true, hasSmartClass:true, hasSports:true },
  { name:'DPS International, Saket', type:'K12', boards:['IB','CBSE'], city:'New Delhi', state:'Delhi', pincode:'110017', address:'Saket, New Delhi', feeMin:150000, feeMax:250000, established:2004, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true, hasSmartClass:true },
  { name:"Bhavan's Vidyashram", type:'K12', boards:['CBSE'], city:'Chennai', state:'Tamil Nadu', pincode:'600004', address:'Ethiraj Salai, Egmore, Chennai', locality:'Egmore', feeMin:40000, feeMax:65000, established:1960, hasLibrary:true, hasScienceLab:true, hasSports:true, hasCanteen:true },
  { name:'Sri Chaitanya School', type:'SENIOR_SECONDARY', boards:['CBSE','STATE_BOARD'], city:'Hyderabad', state:'Telangana', pincode:'500044', address:'Madhapur, Hyderabad', locality:'Madhapur', feeMin:50000, feeMax:80000, established:1986, hasLibrary:true, hasScienceLab:true, hasHostel:true },
  { name:'Indus International School Pune', type:'K12', boards:['IB','CAMBRIDGE'], city:'Pune', state:'Maharashtra', pincode:'411062', address:'Urse, Maval, Pune', hasHostel:true, feeMin:300000, feeMax:500000, established:2008, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true },
  { name:"Loreeto Convent School", type:'K12', boards:['ICSE'], city:'Lucknow', state:'Uttar Pradesh', pincode:'226001', address:'Hazratganj, Lucknow', feeMin:30000, feeMax:55000, established:1872, hasLibrary:true, hasScienceLab:true, hasSports:true },
  { name:'Innocent Hearts School', type:'K12', boards:['CBSE'], city:'Jalandhar', state:'Punjab', pincode:'144001', address:'Green Model Town, Jalandhar', feeMin:25000, feeMax:45000, established:1995, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true, hasSmartClass:true },
  { name:'DAV Public School, Bhubaneswar', type:'K12', boards:['CBSE'], city:'Bhubaneswar', state:'Odisha', pincode:'751016', address:'Chandrasekharpur, Bhubaneswar', feeMin:25000, feeMax:45000, established:1984, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true },
  { name:'Kendriya Vidyalaya, IIT Chennai', type:'K12', boards:['CBSE'], city:'Chennai', state:'Tamil Nadu', pincode:'600036', address:'IIT Campus, Chennai', feeMin:15000, feeMax:20000, established:1978, hasLibrary:true, hasScienceLab:true, hasComputerLab:true, hasSports:true },
]

function makeSlug(name: string, city: string) {
  const s = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${s(name)}-${s(city)}`
}

async function main() {
  console.log('Seeding…')

  // Admin user
  const hash = await bcrypt.hash('Admin@123', 12)
  await db.user.upsert({
    where: { email: 'admin@unischools.in' },
    update: {},
    create: { email: 'admin@unischools.in', name: 'Platform Admin', passwordHash: hash, role: 'PLATFORM_ADMIN' },
  })
  console.log('✓ Admin: admin@unischools.in / Admin@123')

  // Schools
  for (const s of schools) {
    const slug = makeSlug(s.name, s.city)
    await db.school.upsert({
      where: { slug },
      update: {},
      create: { ...s, slug, dataSource: 'manual', isActive: true },
    })
  }
  console.log(`✓ ${schools.length} schools seeded`)
  console.log('\nDone! Run: npx prisma studio')
}

main().catch(console.error).finally(() => db.$disconnect())
