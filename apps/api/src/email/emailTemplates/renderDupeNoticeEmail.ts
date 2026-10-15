//* Hardcoded style values are duplicated from @repo/config/tailwind for MVP

export default function renderDuplicateNoticeEmail(): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #18794e;">Someone tried to sign up with your email</h2>
      <p>We noticed an attempt to sign up to Globe Trotter with your email address.</p>
      <p>If this was you, you can safely ignore this email. Your existing account is unaffected.</p>
      <p>If this wasn't you, someone else may have your email address. Your account is safe, but you may want to change your password.</p>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e8e8ec;">
      <p style="font-size: 0.9rem; color: #60646c; margin: 0;">Globe Trotter</p>
    </div>
  `;
}
