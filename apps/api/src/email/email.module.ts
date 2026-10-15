import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";

//? Not @Global because only the auth module needs it
@Module({
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}