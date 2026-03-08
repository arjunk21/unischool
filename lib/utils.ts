import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function rupees(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

export const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh',
]

export const BOARDS = ['CBSE','ICSE','IB','CAMBRIDGE','STATE_BOARD']

export const TYPES = [
  { value: 'K12',              label: 'K–12' },
  { value: 'PRIMARY',          label: 'Primary (1–5)' },
  { value: 'SECONDARY',        label: 'Secondary (6–10)' },
  { value: 'SENIOR_SECONDARY', label: 'Sr. Secondary (11–12)' },
  { value: 'COLLEGE',          label: 'College' },
  { value: 'COACHING',         label: 'Coaching' },
]
