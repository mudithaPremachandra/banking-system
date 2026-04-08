import nodemailer from "nodemailer";
import transporter, { SMTP_FROM } from "../config/mailer";
import { sendOTPEmail } from "../services/email.service";

jest.mock("../config/mailer", () => ({
  __esModule: true,
  default: {
    sendMail: jest.fn(),
  },
  SMTP_FROM: "noreply@bankingsystem.dev",
}));

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    getTestMessageUrl: jest.fn(),
  },
}));

describe("email.service - sendOTPEmail", () => {
  const originalEnv = process.env;
  const mockedTransporter = transporter as jest.Mocked<typeof transporter>;
  const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should log OTP and not send email when SMTP credentials are missing", async () => {
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await sendOTPEmail("user@example.com", "123456");

    expect(mockedTransporter.sendMail).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[Notification Service] [DEV] OTP for user@example.com: 123456"
    );

    consoleLogSpy.mockRestore();
  });

  it("should send OTP email when SMTP credentials exist", async () => {
    process.env.SMTP_USER = "test-user";
    process.env.SMTP_PASS = "test-pass";
    process.env.SMTP_HOST = "smtp.gmail.com";

    mockedTransporter.sendMail.mockResolvedValueOnce({
      messageId: "test-message-id",
    } as any);

    await sendOTPEmail("user@example.com", "654321");

    expect(mockedTransporter.sendMail).toHaveBeenCalledTimes(1);
    expect(mockedTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: SMTP_FROM,
        to: "user@example.com",
        subject: "Your Banking System OTP Code",
        html: expect.stringContaining("654321"),
      })
    );

    const sentMailArg = mockedTransporter.sendMail.mock.calls[0][0];

    expect(sentMailArg.html).toContain("This code expires in");
    expect(sentMailArg.html).toContain("5 minutes");
    expect(sentMailArg.html).toContain("Do not share this code with anyone");
  });

  it("should log Ethereal preview URL when using Ethereal host and preview URL exists", async () => {
    process.env.SMTP_USER = "test-user";
    process.env.SMTP_PASS = "test-pass";
    process.env.SMTP_HOST = "smtp.ethereal.email";

    mockedTransporter.sendMail.mockResolvedValueOnce({
      messageId: "ethereal-message-id",
    } as any);

    mockedNodemailer.getTestMessageUrl.mockReturnValueOnce(
      "https://ethereal.email/message/preview123"
    );

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await sendOTPEmail("user@example.com", "777888");

    expect(mockedTransporter.sendMail).toHaveBeenCalledTimes(1);
    expect(mockedNodemailer.getTestMessageUrl).toHaveBeenCalledWith({
      messageId: "ethereal-message-id",
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "[Notification Service] Ethereal preview:",
      "https://ethereal.email/message/preview123"
    );

    consoleLogSpy.mockRestore();
  });

  it("should not log preview URL when using Ethereal host but preview URL is null", async () => {
    process.env.SMTP_USER = "test-user";
    process.env.SMTP_PASS = "test-pass";
    process.env.SMTP_HOST = "smtp.ethereal.email";

    mockedTransporter.sendMail.mockResolvedValueOnce({
      messageId: "ethereal-message-id",
    } as any);

    mockedNodemailer.getTestMessageUrl.mockReturnValueOnce(false);

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await sendOTPEmail("user@example.com", "999000");

    expect(mockedTransporter.sendMail).toHaveBeenCalledTimes(1);
    expect(mockedNodemailer.getTestMessageUrl).toHaveBeenCalledTimes(1);

    expect(consoleLogSpy).not.toHaveBeenCalledWith(
      "[Notification Service] Ethereal preview:",
      expect.anything()
    );

    consoleLogSpy.mockRestore();
  });

  it("should throw when transporter.sendMail fails", async () => {
    process.env.SMTP_USER = "test-user";
    process.env.SMTP_PASS = "test-pass";
    process.env.SMTP_HOST = "smtp.gmail.com";

    mockedTransporter.sendMail.mockRejectedValueOnce(new Error("SMTP failure"));

    await expect(sendOTPEmail("user@example.com", "111222")).rejects.toThrow(
      "SMTP failure"
    ); 
    expect(mockedTransporter.sendMail).toHaveBeenCalledTimes(1);
  });
});