import { Module } from "@nestjs/common";
import { AuthModule as BetterAuthModule } from "@thallesp/nestjs-better-auth";
import { EmailModule } from "src/email/email.module";
import { EmailService } from "src/email/email.service";
import { createAuth } from "./auth";

@Module({
  imports: [
    EmailModule,
    BetterAuthModule.forRootAsync({
      imports: [EmailModule],
      useFactory: (emailService: EmailService) => ({
        auth: createAuth(emailService),
      }),
      inject: [EmailService],
    }),
  ],
})
export class AuthModule {}