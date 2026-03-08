import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import slugify from 'slugify'

const db = new PrismaClient()

const schools = [
  { name: 'Delhi Public School, R.K. Puram', type: 'K12', boards: ['CBSE'], city: 'New Delhi', state: 'Delhi', pincode: '110022', address: 'Sector 4, R.K. Puram, New Delhi', locality: 'R.K. Puram', feeMin: 80000, feeMax: 120000, established: 1972, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasTransport: true, hasCCTV: true, hasSmartClass: true, gradesFrom: 'KG', gradesTo: '12', dataSource: 'cbse' },
  { name: 'Kendriya Vidyalaya, Chankyapuri', type: 'K12', boards: ['CBSE'], city: 'New Delhi', state: 'Delhi', pincode: '110021', address: 'Chankyapuri, New Delhi', feeMin: 15000, feeMax: 25000, established: 1965, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, dataSource: 'udise' },
  { name: "St. Xavier's High School", type: 'K12', boards: ['ICSE'], city: 'Mumbai', state: 'Maharashtra', pincode: '400001', address: 'Mahapalika Marg, Mumbai', locality: 'Fort', feeMin: 60000, feeMax: 90000, established: 1869, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasCanteen: true, hasCCTV: true, dataSource: 'cbse' },
  { name: 'The Cathedral and John Connon School', type: 'K12', boards: ['ICSE'], city: 'Mumbai', state: 'Maharashtra', pincode: '400001', address: '6 Purshottamdas Thakurdas Marg, Mumbai', locality: 'Fort', feeMin: 100000, feeMax: 150000, established: 1860, hasLibrary: true, hasScienceLab: true, hasSports: true, dataSource: 'manual' },
  { name: 'Bishop Cotton Boys\' School', type: 'K12', boards: ['CBSE'], city: 'Bangalore', state: 'Karnataka', pincode: '560025', address: 'St. Marks Road, Bangalore', hasHostel: true, feeMin: 200000, feeMax: 350000, established: 1865, hasLibrary: true, hasScienceLab: true, hasSports: true, hasCCTV: true, dataSource: 'manual' },
  { name: 'National Public School, Koramangala', type: 'K12', boards: ['CBSE'], city: 'Bangalore', state: 'Karnataka', pincode: '560034', address: '14 Intermediate Ring Road, Koramangala, Bangalore', locality: 'Koramangala', feeMin: 70000, feeMax: 110000, established: 1985, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasSmartClass: true, dataSource: 'cbse' },
  { name: 'Hyderabad Public School, Begumpet', type: 'K12', boards: ['CBSE'], city: 'Hyderabad', state: 'Telangana', pincode: '500016', address: 'Ramakrishna Road, Begumpet, Hyderabad', locality: 'Begumpet', feeMin: 90000, feeMax: 140000, established: 1923, hasHostel: true, hasLibrary: true, hasScienceLab: true, hasSports: true, dataSource: 'cbse' },
  { name: 'The Doon School', type: 'K12', boards: ['CBSE'], city: 'Dehradun', state: 'Uttarakhand', pincode: '248001', address: 'Mall Road, Dehradun', hasHostel: true, feeMin: 700000, feeMax: 900000, established: 1935, hasLibrary: true, hasScienceLab: true, hasSports: true, hasCanteen: true, dataSource: 'manual' },
  { name: 'La Martiniere for Boys', type: 'K12', boards: ['ICSE'], city: 'Kolkata', state: 'West Bengal', pincode: '700019', address: '11 Loudon Street, Kolkata', hasHostel: true, feeMin: 80000, feeMax: 120000, established: 1836, hasLibrary: true, hasScienceLab: true, hasSports: true, dataSource: 'manual' },
  { name: 'DAV Public School, Chandrasekharpur', type: 'K12', boards: ['CBSE'], city: 'Bhubaneswar', state: 'Odisha', pincode: '751016', address: 'Chandrasekharpur, Bhubaneswar', feeMin: 25000, feeMax: 45000, established: 1984, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, dataSource: 'udise' },
  { name: 'Sardar Patel Vidyalaya', type: 'K12', boards: ['CBSE'], city: 'New Delhi', state: 'Delhi', pincode: '110003', address: 'Lodi Road, New Delhi', locality: 'Lodi Colony', feeMin: 40000, feeMax: 65000, established: 1958, hasLibrary: true, hasScienceLab: true, hasSports: true, dataSource: 'cbse' },
  { name: 'Podar International School', type: 'K12', boards: ['CBSE', 'IB'], city: 'Mumbai', state: 'Maharashtra', pincode: '400056', address: 'Podar Compound, Santacruz West, Mumbai', locality: 'Santacruz', feeMin: 120000, feeMax: 200000, established: 1927, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasSmartClass: true, hasCCTV: true, dataSource: 'manual' },
  { name: 'The Heritage School', type: 'K12', boards: ['CBSE'], city: 'Kolkata', state: 'West Bengal', pincode: '700107', address: '994 Madudah, Plot J1-2, Sector 3, Kolkata', feeMin: 70000, feeMax: 100000, established: 1995, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSmartClass: true, hasSports: true, dataSource: 'cbse' },
  { name: 'Amity International School, Saket', type: 'K12', boards: ['CBSE'], city: 'New Delhi', state: 'Delhi', pincode: '110017', address: 'Sector 6, Pushp Vihar, Saket, New Delhi', locality: 'Saket', feeMin: 85000, feeMax: 130000, established: 1996, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasSmartClass: true, hasTransport: true, hasCCTV: true, dataSource: 'cbse' },
  { name: 'GD Goenka World School', type: 'K12', boards: ['CBSE', 'CAMBRIDGE'], city: 'Gurugram', state: 'Haryana', pincode: '122001', address: 'Sohna Gurgaon Road, Gurugram', hasHostel: true, feeMin: 150000, feeMax: 250000, established: 2004, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasSmartClass: true, dataSource: 'manual' },
  { name: 'Children\'s Academy, Kandivali', type: 'SECONDARY', boards: ['CBSE'], city: 'Mumbai', state: 'Maharashtra', pincode: '400067', address: 'Thakur Village, Kandivali East, Mumbai', locality: 'Kandivali', feeMin: 45000, feeMax: 70000, established: 1981, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, dataSource: 'cbse' },
  { name: 'Tagore Baal Niketan Senior Secondary School', type: 'SENIOR_SECONDARY', boards: ['CBSE'], city: 'Jaipur', state: 'Rajasthan', pincode: '302001', address: 'Tagore Nagar, Jaipur', feeMin: 20000, feeMax: 35000, established: 1975, hasLibrary: true, hasScienceLab: true, hasSports: true, dataSource: 'udise' },
  { name: 'Rajkumar College', type: 'K12', boards: ['CBSE'], city: 'Rajkot', state: 'Gujarat', pincode: '360001', address: 'Rajkumar College Road, Rajkot', hasHostel: true, feeMin: 250000, feeMax: 400000, established: 1870, hasLibrary: true, hasScienceLab: true, hasSports: true, dataSource: 'manual' },
  { name: 'Mayo College', type: 'K12', boards: ['CBSE'], city: 'Ajmer', state: 'Rajasthan', pincode: '305001', address: 'Mayo College Road, Ajmer', hasHostel: true, feeMin: 500000, feeMax: 700000, established: 1875, hasLibrary: true, hasScienceLab: true, hasSports: true, hasCanteen: true, dataSource: 'manual' },
  { name: 'Scindia School', type: 'K12', boards: ['CBSE'], city: 'Gwalior', state: 'Madhya Pradesh', pincode: '474008', address: 'Gwalior Fort, Gwalior', hasHostel: true, feeMin: 450000, feeMax: 600000, established: 1897, hasLibrary: true, hasScienceLab: true, hasSports: true, dataSource: 'manual' },
  { name: 'Vidyashilp Academy', type: 'K12', boards: ['CBSE', 'IB'], city: 'Bangalore', state: 'Karnataka', pincode: '560064', address: 'Yelahanka, Bangalore', locality: 'Yelahanka', feeMin: 130000, feeMax: 200000, established: 2002, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasSmartClass: true, hasCCTV: true, dataSource: 'cbse' },
  { name: 'Sri Chaitanya School', type: 'SENIOR_SECONDARY', boards: ['CBSE', 'STATE_BOARD'], city: 'Hyderabad', state: 'Telangana', pincode: '500044', address: 'Madhapur, Hyderabad', locality: 'Madhapur', feeMin: 50000, feeMax: 80000, established: 1986, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasHostel: true, dataSource: 'cbse' },
  { name: 'DPS International, Saket', type: 'K12', boards: ['IB', 'CBSE'], city: 'New Delhi', state: 'Delhi', pincode: '110017', address: 'Saket, New Delhi', locality: 'Saket', feeMin: 150000, feeMax: 250000, established: 2004, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasSmartClass: true, hasCCTV: true, dataSource: 'manual' },
  { name: 'Bhavan\'s Vidyashram', type: 'K12', boards: ['CBSE'], city: 'Chennai', state: 'Tamil Nadu', pincode: '600004', address: 'Ethiraj Salai, Egmore, Chennai', locality: 'Egmore', feeMin: 40000, feeMax: 65000, established: 1960, hasLibrary: true, hasScienceLab: true, hasSports: true, hasCanteen: true, dataSource: 'cbse' },
  { name: 'Kendriya Vidyalaya, IIT Chennai', type: 'K12', boards: ['CBSE'], city: 'Chennai', state: 'Tamil Nadu', pincode: '600036', address: 'IIT Campus, Chennai', feeMin: 15000, feeMax: 20000, established: 1978, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, dataSource: 'udise' },
  { name: 'Loreeto Convent School', type: 'K12', boards: ['ICSE'], city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', address: 'Hazratganj, Lucknow', feeMin: 30000, feeMax: 55000, established: 1872, hasLibrary: true, hasScienceLab: true, hasSports: true, dataSource: 'cbse' },
  { name: 'St. Joseph\'s Boys\' High School', type: 'K12', boards: ['CBSE'], city: 'Bangalore', state: 'Karnataka', pincode: '560027', address: 'Museum Road, Bangalore', locality: 'Shivajinagar', feeMin: 35000, feeMax: 60000, established: 1858, hasLibrary: true, hasScienceLab: true, hasSports: true, dataSource: 'cbse' },
  { name: 'Innocent Hearts School', type: 'K12', boards: ['CBSE'], city: 'Jalandhar', state: 'Punjab', pincode: '144001', address: 'Green Model Town, Jalandhar', feeMin: 25000, feeMax: 45000, established: 1995, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasSmartClass: true, dataSource: 'cbse' },
  { name: 'Springdales School, Pusa Road', type: 'K12', boards: ['CBSE'], city: 'New Delhi', state: 'Delhi', pincode: '110060', address: 'Pusa Road, New Delhi', locality: 'Pusa Road', feeMin: 55000, feeMax: 85000, established: 1955, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasSmartClass: true, dataSource: 'cbse' },
  { name: 'Indus International School Pune', type: 'K12', boards: ['IB', 'CAMBRIDGE'], city: 'Pune', state: 'Maharashtra', pincode: '411062', address: 'Urse, Maval, Pune', hasHostel: true, feeMin: 300000, feeMax: 500000, established: 2008, hasLibrary: true, hasScienceLab: true, hasComputerLab: true, hasSports: true, hasSmartClass: true, dataSource: 'manual' },
]

async function main() {
  console.log('Seeding UniSchools database...')

  // Platform admin
  const adminHash = await bcrypt.hash('Admin@123', 12)
  await db.user.upsert({
    where: { email: 'admin@unischools.in' },
    update: {},
    create: {
      email: 'admin@unischools.in',
      name: 'Platform Admin',
      passwordHash: adminHash,
      role: 'PLATFORM_ADMIN',
    },
  })
  console.log('✓ Admin user: admin@unischools.in / Admin@123')

  // Schools
  let created = 0
  for (const s of schools) {
    const rawSlug = slugify(s.name, { lower: true, strict: true })
    // make slug unique by appending city
    const slug = `${rawSlug}-${slugify(s.city, { lower: true, strict: true })}`

    await db.school.upsert({
      where: { slug },
      update: {},
      create: { ...s, slug },
    })
    created++
  }

  console.log(`✓ Created ${created} schools`)
  console.log('\nDone! Run: npm run db:studio to browse the data.')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
