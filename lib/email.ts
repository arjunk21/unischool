import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.EMAIL_FROM || 'UniSchools <noreply@unischools.in>'

export async function emailEnquiryToSchool(args: {
  schoolEmail: string; schoolName: string
  parentName: string; parentEmail: string; parentPhone?: string | null
  studentName: string; grade: string; message?: string | null
}) {
  return resend.emails.send({
    from: FROM, to: args.schoolEmail, replyTo: args.parentEmail,
    subject: `New Admission Enquiry — ${args.studentName} (${args.grade})`,
    html: `<div style="font-family:sans-serif;max-width:580px;margin:0 auto">
      <div style="background:#1a3c6e;padding:20px 24px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0;font-size:18px">New Admission Enquiry</h2>
        <p style="color:#93c5fd;margin:4px 0 0;font-size:13px">via UniSchools</p>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
        <p style="color:#374151">Dear <strong>${args.schoolName}</strong> admissions team,</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          ${[['Parent Name',args.parentName],['Email',args.parentEmail],['Phone',args.parentPhone||'—'],['Student',args.studentName],['Grade Applying',args.grade]].map(([k,v])=>`<tr><td style="padding:8px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:600;color:#374151;width:38%">${k}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#374151">${v}</td></tr>`).join('')}
        </table>
        ${args.message ? `<div style="background:#fff7ed;border-left:3px solid #f97316;padding:12px 16px;border-radius:4px"><p style="margin:0;font-size:14px;color:#374151">${args.message}</p></div>` : ''}
        <p style="font-size:12px;color:#9ca3af;margin-top:20px">Reply directly to this email to contact the parent.</p>
      </div>
    </div>`,
  })
}

export async function emailEnquiryConfirmToParent(args: {
  parentEmail: string; parentName: string; schoolName: string; studentName: string
}) {
  return resend.emails.send({
    from: FROM, to: args.parentEmail,
    subject: `Enquiry sent to ${args.schoolName} — UniSchools`,
    html: `<div style="font-family:sans-serif;max-width:580px;margin:0 auto">
      <div style="background:#1a3c6e;padding:20px 24px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0">Enquiry Sent ✓</h2>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
        <p style="color:#374151">Hi <strong>${args.parentName}</strong>,</p>
        <p style="color:#6b7280">Your enquiry for <strong>${args.studentName}</strong> has been sent to <strong>${args.schoolName}</strong>. They will contact you within 2–3 business days.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display:inline-block;background:#1a3c6e;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:8px">Browse More Schools</a>
      </div>
    </div>`,
  })
}

export async function emailClaimReceived(args: {
  toEmail: string; name: string; schoolName: string
}) {
  return resend.emails.send({
    from: FROM, to: args.toEmail,
    subject: `Claim request received — ${args.schoolName}`,
    html: `<div style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:32px">
      <h2 style="color:#1a3c6e">Claim Request Received</h2>
      <p style="color:#374151">Hi <strong>${args.name}</strong>,</p>
      <p style="color:#6b7280">We've received your claim for <strong>${args.schoolName}</strong>. Our team will verify your documents within 2–3 business days.</p>
    </div>`,
  })
}
