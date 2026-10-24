import { Test, TestingModule } from "@nestjs/testing";
import { DRIZZLE } from "../database/database.module";
import { UserProgressRow, UserProgressService } from "./user-progress.service";

const mockInsertFn = (
  outcome: "resolve" | "reject",
  value: UserProgressRow | Error
): jest.Mock<any, any, any> => {
  const returningFn = outcome === "resolve"
    ? jest.fn().mockResolvedValue(value)
    : jest.fn().mockRejectedValue(value);

  return jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      onConflictDoUpdate: jest.fn().mockReturnValue({
        returning: returningFn
      })
    })
  });
}

describe("UserProgressService", () => {
  let userProgressService: UserProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProgressService,
        { provide: DRIZZLE, useValue: { select: jest.fn(), insert: jest.fn() } }
      ]
    }).compile();

    userProgressService = module.get(UserProgressService);
  });

  it("throws a BadRequestException when both tutorialId and labId are set", () => {
    
  });
});