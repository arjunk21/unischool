'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send, CheckCircle2 } from 'lucide-react'

type FormData = {
  parentName: string; parentEmail: string; parentPhone: string
  studentName: string; grade: string; session: string; message: string
}

const GRADES = ['Nursery','KG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11 (Science)','Grade 11 (Commerce)','Grade 11 (Arts)','Grade 12 (Science)','Grade 12 (Commerce)','Grade 12 (Arts)']
const SESSIONS = ['2025–26','2026–27','2027–28']

export function EnquiryForm({ schoolId, schoolName }: { schoolId: string; schoolName: string }) {
  const [sent, setSent] = useState(false)
  const [err,  setErr]  = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setErr('')
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId, ...data }),
    })
    if (res.ok) { setSent(true) }
    else { const j = await res.json(); setErr(j.error || 'Failed. Please try again.') }
  }

  if (sent) return (
    <div className="card p-6 text-center">
      <CheckCircle2 className="w-12 h-12 text-teal mx-auto mb-3" />
      <h3 className="font-bold text-gray-900 mb-1">Enquiry Sent!</h3>
      <p className="text-sm text-gray-500">We've forwarded your details to <strong>{schoolName}</strong>. They'll contact you within 2–3 business days.</p>
    </div>
  )

  return (
    <div className="card p-5">
      <h3 className="font-bold text-gray-900 mb-1">Send Admission Enquiry</h3>
      <p className="text-xs text-gray-500 mb-4">Free. Goes directly to {schoolName}.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="label">Parent / Guardian Name *</label>
          <input {...register('parentName', { required: true, minLength: 2 })} className="input" placeholder="Your full name" />
          {errors.parentName && <p className="text-xs text-red-500 mt-1">Required</p>}
        </div>
        <div>
          <label className="label">Email *</label>
          <input {...register('parentEmail', { required: true, pattern: /^\S+@\S+\.\S+$/ })} className="input" type="email" placeholder="you@email.com" />
          {errors.parentEmail && <p className="text-xs text-red-500 mt-1">Valid email required</p>}
        </div>
        <div>
          <label className="label">Phone</label>
          <input {...register('parentPhone')} className="input" placeholder="+91 98765 43210" />
        </div>
        <div>
          <label className="label">Student Name *</label>
          <input {...register('studentName', { required: true })} className="input" placeholder="Child's name" />
          {errors.studentName && <p className="text-xs text-red-500 mt-1">Required</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Grade Applying For *</label>
            <select {...register('grade', { required: true })} className="input">
              <option value="">Select grade</option>
              {GRADES.map(g=><option key={g}>{g}</option>)}
            </select>
            {errors.grade && <p className="text-xs text-red-500 mt-1">Required</p>}
          </div>
          <div>
            <label className="label">Academic Session *</label>
            <select {...register('session', { required: true })} className="input">
              {SESSIONS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Message (optional)</label>
          <textarea {...register('message')} className="input resize-none h-20" placeholder="Any specific questions…" />
        </div>

        {err && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{err}</p>}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Sending…' : <><Send className="w-4 h-4" /> Send Enquiry</>}
        </button>
        <p className="text-xs text-gray-400 text-center">Your details are shared only with this school.</p>
      </form>
    </div>
  )
}
