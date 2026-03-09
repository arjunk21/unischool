import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY || 're_stub');
const FROM   = process.env.EMAIL_FROM || 'UniSchools <noreply@unischools.in>'

export async function emailEnquiryToSchool(p: {
  schoolEmail: string; schoolName: string
  parentName: string; parentEmail: string; parentPhone?: string | null
  studentName: string; grade: string; message?: string | null
}) {
  return resend.emails.send({
    from: FROM, to: p.schoolEmail, replyTo: p.parentEmail,
    subject: `New Admission Enquiry — ${p.studentName} (${p.grade})`,
    html: `<div style="font-family:sans-serif;max-width:580px;margin:0 auto">
      <div style="background:#1a3c6e;padding:20px 24px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0">New Admission Enquiry</h2>
        <p style="color:#93c5fd;margin:4px 0 0;font-size:13px">via UniSchools</p>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          ${[['Parent',p.parentName],['Email',p.parentEmail],['Phone',p.parentPhone||'—'],['Student',p.studentName],['Grade',p.grade]].map(([k,v])=>`<tr><td style="padding:8px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:600;width:35%">${k}</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${v}</td></tr>`).join('')}
        </table>
        ${p.message ? `<div style="background:#fff7ed;border-left:3px solid #f97316;padding:12px;border-radius:4px"><p style="margin:0">${p.message}</p></div>` : ''}
        <p style="font-size:12px;color:#9ca3af;margin-top:16px">Reply to this email to contact the parent directly.</p>
      </div>
    </div>`,
  })
}

export async function emailEnquiryConfirm(p: {
  parentEmail: string; parentName: string; schoolName: string
}) {
  return resend.emails.send({
    from: FROM, to: p.parentEmail,
    subject: `Enquiry sent to ${p.schoolName}`,
    html: `<div style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:32px">
      <h2 style="color:#1a3c6e">Enquiry Sent ✓</h2>
      <p>Hi <strong>${p.parentName}</strong>,</p>
      <p style="color:#6b7280">Your enquiry has been sent to <strong>${p.schoolName}</strong>. They will contact you within 2–3 business days.</p>
    </div>`,
  })
}

export async function emailClaimReceived(p: {
  toEmail: string; name: string; schoolName: string
}) {
  return resend.emails.send({
    from: FROM, to: p.toEmail,
    subject: `Claim request received — ${p.schoolName}`,
    html: `<div style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:32px">
      <h2 style="color:#1a3c6e">Claim Request Received</h2>
      <p>Hi <strong>${p.name}</strong>,</p>
      <p style="color:#6b7280">We've received your claim for <strong>${p.schoolName}</strong>. We'll verify and respond within 2–3 business days.</p>
    </div>`,
  })
}
