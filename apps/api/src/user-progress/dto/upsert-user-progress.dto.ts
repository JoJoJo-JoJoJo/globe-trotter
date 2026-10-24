import { userProgressStatusEnum } from "@repo/database";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { UserProgressStatus } from "../user-progress.service";

export class UpsertUserProgressDto {
  @IsUUID()
  moduleId!: string;

  @IsOptional()
  @IsUUID()
  tutorialId?: string | null;

  @IsOptional()
  @IsUUID()
  labId?: string | null;

  @IsEnum(userProgressStatusEnum)
  status!: UserProgressStatus;
}