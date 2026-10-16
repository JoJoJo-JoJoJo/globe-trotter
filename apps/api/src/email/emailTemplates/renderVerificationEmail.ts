//* Hardcoded style values are duplicated from @repo/config/tailwind for MVP

export default function renderVerificationEmail(url: string): string {
  return `
    <div style="font-family: system-ui, sora; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #18794e;">Verify your email address</h2>
      <p>We appreciate you signing up to Globe Trotter. Click the button below to verify your email address.</p>
      <p style="margin: 24px 0;">
        <a
          href="${url}"
          style="background: #299764; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;"
        >
          Verify email
        </a>
      </p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${url}</p>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e8e8ec;">
      <p style="font-size: 0.9rem; color: #60646c; margin: 0;">Globe Trotter</p>
      <p style="font-size: 0.8rem; color: #8b8d98; margin: 4px 0 0;">
        If this wasn't you, please ignore this email.
      </p>
    </div>
  `;
}
