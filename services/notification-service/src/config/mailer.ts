/**
 * Nodemailer Transporter Configuration
 * OWNER: Geethika (Notification Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file creates and exports the Nodemailer transporter.
 * It can be imported by email.service.ts instead of creating the
 * transporter inline.
 *
 * CONFIGURATION:
 * - SMTP_HOST: SMTP server hostname (default: smtp.ethereal.email)
 * - SMTP_PORT: SMTP server port (default: 587)
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 * - SMTP_FROM: Sender email address
 *
 * DEVELOPMENT SETUP:
 * Use Ethereal (https://ethereal.email/) for testing.
 * Ethereal captures all emails — nothing is actually delivered.
 * You can view sent emails at https://ethereal.email/messages
 *
 * PRODUCTION:
 * Replace with a real SMTP provider (SendGrid, AWS SES, Mailgun, etc.)
 *
 * TODO (Geethika):
 * - Create the transporter with env var configuration
 * - Add a verify() call on startup to test SMTP connection
 * - Export the transporter for use in email.service.ts
 */
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// TODO (Geethika): Verify SMTP connection on startup
// transporter.verify()
//   .then(() => console.log("[Mailer] SMTP connection verified"))
//   .catch((err) => console.error("[Mailer] SMTP connection failed:", err));

export const SMTP_FROM = process.env.SMTP_FROM || "noreply@bankingsystem.dev";

export default transporter;
