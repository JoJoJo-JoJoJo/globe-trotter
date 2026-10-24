import { Body, Controller, Get, Post, Query, ValidationPipe } from "@nestjs/common";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";
import { ListUserProgressQueryDto } from "./dto/list-user-progress-query.dto";
import { UpsertUserProgressDto } from "./dto/upsert-user-progress.dto";
import { UserProgressService } from "./user-progress.service";

@Controller("user-progress")
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Get()
  findAll(
    @Session() session: UserSession,
    @Query(new ValidationPipe({ transform: true })) query: ListUserProgressQueryDto
  ) {
    return this.userProgressService.findAllForUser(session.user.id, query);
  }

  @Post()
  upsert(
    @Session() session: UserSession,
    @Body() body: UpsertUserProgressDto
  ) {
    return { userId: session.user.id, body };
  }
}