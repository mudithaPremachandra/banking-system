/**
 * Email Service — Nodemailer Integration
 * OWNER: Geethika (Notification Service Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file handles all email delivery using Nodemailer.
 * For DEVELOPMENT, use Ethereal (https://ethereal.email/) — a fake SMTP service
 * that captures emails without sending them to real addresses.
 *
 * IMPLEMENTATION:
 *
 * 1. Create Nodemailer transporter using SMTP config from environment variables:
 *    - SMTP_HOST (default: smtp.ethereal.email)
 *    - SMTP_PORT (default: 587)
 *    - SMTP_USER (Ethereal username)
 *    - SMTP_PASS (Ethereal password)
 *    - SMTP_FROM (sender address, default: noreply@bankingsystem.dev)
 *
 * 2. sendOTPEmail(to: string, otp: string)
 *    - Send an HTML email with:
 *      - Subject: "Your Banking System OTP Code"
 *      - Body: styled HTML with the OTP code displayed prominently
 *      - Include: "This code expires in 5 minutes"
 *      - Include: "Do not share this code with anyone"
 *    - Log the Ethereal preview URL in development (for viewing the email)
 *
 * ETHEREAL SETUP (for development):
 * 1. Go to https://ethereal.email/
 * 2. Click "Create Ethereal Account"
 * 3. Copy the SMTP credentials into your .env file
 * 4. All emails will be captured at https://ethereal.email/messages
 *
 * ALTERNATIVE FOR DEVELOPMENT:
 * If you don't want to set up Ethereal, you can just log the OTP to console:
 *   console.log(`[DEV] OTP for ${to}: ${otp}`);
 *
 * TODO (Geethika):
 * - Create the Nodemailer transporter
 * - Implement sendOTPEmail with HTML template
 * - Add console logging fallback for development
 * - Consider adding retry logic for transient SMTP failures
 */
import nodemailer from "nodemailer";

// TODO (Geethika): Create Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.ethereal.email",
//   port: parseInt(process.env.SMTP_PORT || "587"),
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

export async function sendOTPEmail(to: string, otp: string): Promise<void> {
  // TODO (Geethika): Implement email sending
  //
  // const mailOptions = {
  //   from: process.env.SMTP_FROM || "noreply@bankingsystem.dev",
  //   to,
  //   subject: "Your Banking System OTP Code",
  //   html: `
  //     <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
  //       <h2 style="color: #333;">Banking System</h2>
  //       <p>Your one-time password (OTP) is:</p>
  //       <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; border-radius: 8px;">
  //         ${otp}
  //       </div>
  //       <p style="color: #666; margin-top: 16px;">This code expires in <strong>5 minutes</strong>.</p>
  //       <p style="color: #999; font-size: 12px;">Do not share this code with anyone. If you did not request this code, please ignore this email.</p>
  //     </div>
  //   `,
  // };
  //
  // const info = await transporter.sendMail(mailOptions);
  //
  // // In development with Ethereal, log the preview URL
  // if (process.env.SMTP_HOST?.includes("ethereal")) {
  //   console.log("[Email] Preview URL:", nodemailer.getTestMessageUrl(info));
  // }

  // TEMPORARY: Log OTP to console for development
  console.log(`[Notification Service] OTP for ${to}: ${otp}`);
  console.log("TODO: Geethika — implement actual email sending via Nodemailer");
}
