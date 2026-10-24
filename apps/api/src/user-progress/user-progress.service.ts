import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DRIZZLE } from "../database/database.module";
import { and, Db, eq, InferSelectModel, userProgress } from "@repo/database";
import { ListUserProgressQueryDto } from "./dto/list-user-progress-query.dto";
import { UpsertUserProgressDto } from "./dto/upsert-user-progress.dto";
import { isFKViolation } from "../lib/pg-errors";

export type UserProgressRow = InferSelectModel<typeof userProgress>;
export type UserProgressStatus = UserProgressRow["status"];

@Injectable()
export class UserProgressService {
  constructor(@Inject(DRIZZLE) private readonly db: Db) { }
  
  async findAllForUser(
    userId: string,
    filters: ListUserProgressQueryDto
  ) {
    const conditions = [eq(userProgress.userId, userId)];

    if (filters.moduleId) {
      conditions.push(eq(userProgress.moduleId, filters.moduleId));
    }
    if (filters.tutorialId) {
      conditions.push(eq(userProgress.tutorialId, filters.tutorialId));
    }
    if (filters.labId) {
      conditions.push(eq(userProgress.labId, filters.labId));
    }

    return this.db
      .select()
      .from(userProgress)
      .where(and(...conditions));
  }

  async upsert(
    userId: string,
    dto: UpsertUserProgressDto
  ): Promise<UserProgressRow> {
    if (dto.tutorialId && dto.labId) {
      throw new BadRequestException("Only one of tutorialId or labId may be set");
    }

    // throw new Error("Not implemented");

    const values = {
      userId,
      moduleId: dto.moduleId,
      tutorialId: dto.tutorialId ?? null,
      labId: dto.labId ?? null,
      status: dto.status
    };

    try {
      const [row] = await this.db
        .insert(userProgress)
        .values(values)
        .onConflictDoUpdate({
          target: [
            userProgress.userId,
            userProgress.moduleId,
            userProgress.tutorialId,
            userProgress.labId
          ],
          set: { status: dto.status, updatedAt: new Date() }
        })
        .returning();
        
      if (typeof row === "undefined") {
        throw new InternalServerErrorException("Returned row is undefined - temp error throw from user-progress service");
      }
      
      return row;
    } catch (err: unknown) {
      if (isFKViolation(err)) {
        throw new BadRequestException(
          dto.labId
            ? "Lab does not belong to the specified module"
            : "Tutorial does not belong to the specified module"
        )
      }
      throw err;
    }
  }
}