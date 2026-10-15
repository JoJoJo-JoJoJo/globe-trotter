import { Resend } from "resend";
import renderVerificationEmail from "./renderVerificationEmail";
import renderDuplicateNoticeEmail from "./renderDuplicateNoticeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, url: string) {
  //? No SMTP server in CI so the stub must remain for that environment
  if (process.env.NODE_ENV === 'test') {
    console.log(`[auth] Verification URL for ${to}: ${url}`);
    return;
  }

  if (process.env.EMAIL_PROVIDER === "resend") {
    //* Use resend SDK
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "noreply@globe-trotter.dev",
      to,
      subject: "Verify your email address",
      html: renderVerificationEmail(url),
      text: `Click the link to verify your email: ${url}`,
    });
  } else {
    //* Use nodemailer SMTP, pointing at Mailpit
  }
}

export async function sendDuplicateSignUpNotice(to: string) {
  //? No SMTP server in CI so the stub must remain for that environment
  if (process.env.NODE_ENV === 'test') {
    console.log(`[auth] Duplicate sign-up notice sent to ${to}`);
    return;
  }

  if (process.env.EMAIL_PROVIDER === "resend") {
    //* Use resend SDK
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "noreply@globe-trotter.dev",
      to,
      subject: "Duplicate sign-up notice",
      html: renderDuplicateNoticeEmail(to),
      text: `We noticed that somebody is trying to access your account at ${to} - is this you?`,
    });
  } else {
    //* Use nodemailer SMTP, pointing at Mailpit
  }
}
