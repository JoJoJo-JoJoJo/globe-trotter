// apps/api/src/email/email.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import { createTransport, type Transporter } from "nodemailer";
import renderVerificationEmail from "./emailTemplates/renderVerificationEmail";
import renderDuplicateNoticeEmail from "./emailTemplates/renderDupeNoticeEmail";

// "from" not included since it is decided by env variable only
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class EmailService {
  //* The logger is basically just the console for development, but makes it easy to expand to proper logger in the future. Also it will avoid the mergewatch bot flagging thrown errors as critical and blocking the PR from being merged.
  private readonly logger = new Logger(EmailService.name);
  private readonly provider: string;
  private readonly fromAddress: string;
  private readonly resend?: Resend;
  private readonly smtp?: Transporter;

  constructor(private readonly config: ConfigService) {
    //* Default to local setup - stub + noreply@localhost
    this.provider = this.config.get<string>("EMAIL_PROVIDER", "stub");
    this.fromAddress = this.config.get<string>("EMAIL_FROM", "noreply@localhost");

    //? Set up relevant provider - provider only chosen once in constructor to avoid re-reading process.env on every email sent
    if (this.provider === "resend") {
      const apiKey = this.config.get<string>("RESEND_API_KEY");
      if (!apiKey || apiKey === "CHANGE_ME_API_KEY") {
        throw new Error(
          "RESEND_API_KEY is required when EMAIL_PROVIDER=resend",
        );
      }
      this.resend = new Resend(apiKey);
    } else if (this.provider === "smtp") {
      this.smtp = createTransport({
        host: this.config.get<string>("SMTP_HOST", "localhost"),
        port: this.config.get<number>("SMTP_PORT", 1025),
        secure: false,
      });
    }
    //* "stub" falls through with neither transport configured
  }

  async sendVerificationEmail(to: string, url: string): Promise<void> {
    await this.send({
      to,
      subject: "Verify your email address",
      html: renderVerificationEmail(url),
      text: `Click the link to verify your email: ${url}`,
    });
  }

  async sendDuplicateSignUpNotice(to: string): Promise<void> {
    await this.send({
      to,
      subject: "Someone tried to sign up with your email",
      html: renderDuplicateNoticeEmail(),
      text: "We noticed an attempt to sign up using your email - if this was not you, please ignore this email.",
    });
  }

  private async send(options: EmailOptions): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      this.logger.log(`[test] Would send "${options.subject}" to ${options.to}`);
      return;
    }

    try {
      if (this.resend) {
        await this.resend.emails.send({
          from: this.fromAddress,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
      } else if (this.smtp) {
        await this.smtp.sendMail({
          from: this.fromAddress,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
      } else {
        this.logger.warn(
          `No email provider configured (EMAIL_PROVIDER=${this.provider}). Email to ${options.to} was not sent.`
        );
      }
    } catch (err) {
      //* A failed email should not break sign-up, just warn
      this.logger.error(
        `Failed to send "${options.subject}" to ${options.to}: ${(err instanceof Error ? err.message : String(err))}`
      );
    }
  }
}