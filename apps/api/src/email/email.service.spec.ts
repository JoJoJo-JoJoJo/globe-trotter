jest.mock("nodemailer");

import { ConfigService } from "@nestjs/config";
import { EmailService } from "./email.service"
import { Test, TestingModule } from "@nestjs/testing";
import { createTransport } from "nodemailer";

const mockCreateTransport = createTransport as jest.MockedFunction<typeof createTransport>;
const URLOrigin = "http://localhost:4000";

describe("EmailService", () => {
  let service: EmailService;
  let configService: Partial<ConfigService>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("with EMAIL_PROVIDER=stub", () => {
    beforeEach(async () => {
      configService = {
        get: jest.fn().mockImplementation((key: string, defaultValue?: unknown) => {
          switch (key) {
            case "EMAIL_PROVIDER":
              return "stub";
            case "EMAIL_FROM":
              return "noreply@localhost";
            default:
              return defaultValue;
          }
        }),
      }

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          { provide: ConfigService, useValue: configService },
        ],
      }).compile();

      service = module.get<EmailService>(EmailService);
    });

    it("does not throw when EMAIL_PROVIDER is stub", async () => {
      await expect(
        service.sendVerificationEmail("test1@example.dev", URLOrigin + "/verify")
      ).resolves.toBeUndefined();
    });

    it("does not attempt a network call", async () => {
      //? Watch for console.warn() calls - should warn if no provider set up (i.e. EMAIL_PROVIDER=stub)
      const logSpy = jest.spyOn((service as any).logger, "log").mockImplementation();
      await service.sendVerificationEmail("test1@example.dev", URLOrigin + "/verify");
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe("with EMAIL_PROVIDER=smtp", () => {
    const mockSendMail = jest.fn().mockResolvedValue({ messageId: "test-message-id" });
    mockCreateTransport.mockReturnValue({ sendMail: mockSendMail } as any);

    beforeEach(async () => {
      configService = {
        get: jest.fn().mockImplementation((key: string, defaultValue?: unknown) => {
          switch (key) {
            case "EMAIL_PROVIDER":
              return "smtp";
            case "EMAIL_FROM":
              return "noreply@localhost";
            case "SMTP_HOST":
              return "localhost";
            case "SMTP_PORT":
              return 1025;
            default:
              return defaultValue;
          }
        }),
      }

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          { provide: ConfigService, useValue: configService },
        ],
      }).compile();

      service = module.get<EmailService>(EmailService);
    });

    it("calls nodemailer sendMail when EMAIL_PROVIDER is smtp", async () => {
      await service.sendVerificationEmail("test1@example.dev", URLOrigin + "/verify?token=test");

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "noreply@localhost",
          to: "test1@example.dev",
          subject: "Verify your email address",
        })
      );
    });

    // In case somebody changes the SMTP config without realizing
    it("createTransport is configured correctly", async () => {
      await service.sendVerificationEmail("test1@example.dev", URLOrigin + "/verify?token=test");

      expect(mockCreateTransport).toHaveBeenCalledWith({
        host: "localhost",
        port: 1025,
        secure: false,
      })
    });
  });
});