import { Router } from "express";
import nodemailer from "nodemailer";
import { logger } from "../lib/logger.js";

const contactRouter = Router();

interface ContactBody {
  name: string;
  email: string;
  projectType?: string;
  budget?: string;
  message: string;
}

/** Basic email-format check */
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Build a Nodemailer transporter from Replit Secrets (env vars) */
function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER and GMAIL_APP_PASSWORD environment variables must be set.",
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

contactRouter.post("/contact", async (req, res) => {
  const { name, email, projectType, budget, message } =
    req.body as ContactBody;

  // Server-side validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res
      .status(400)
      .json({ error: "Name, email, and message are required." });
    return;
  }
  if (!isValidEmail(email.trim())) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  const recipient = "we.tantra.stack@gmail.com";

  const htmlBody = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#0b0918;padding:28px 32px;border-radius:12px 12px 0 0">
    <h1 style="margin:0;font-size:22px;color:#2be7bd;letter-spacing:-.03em">
      New project inquiry — TantraStack
    </h1>
  </div>
  <div style="background:#f9f8fd;padding:28px 32px;border:1px solid #e4e0f0;border-top:0;border-radius:0 0 12px 12px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e4e0f0;width:130px;color:#666;font-weight:600">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #e4e0f0">${escapeHtml(name.trim())}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e4e0f0;color:#666;font-weight:600">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e4e0f0">
          <a href="mailto:${escapeHtml(email.trim())}" style="color:#6b52dc">${escapeHtml(email.trim())}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e4e0f0;color:#666;font-weight:600">Project Type</td>
        <td style="padding:10px 0;border-bottom:1px solid #e4e0f0">${escapeHtml(projectType?.trim() || "Not specified")}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e4e0f0;color:#666;font-weight:600">Budget Range</td>
        <td style="padding:10px 0;border-bottom:1px solid #e4e0f0">${escapeHtml(budget?.trim() || "Not specified")}</td>
      </tr>
    </table>

    <div style="margin-top:24px">
      <p style="margin:0 0 10px;color:#666;font-weight:600;font-size:14px">Message</p>
      <div style="background:#fff;border:1px solid #e4e0f0;border-radius:8px;padding:16px 18px;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(message.trim())}</div>
    </div>

    <p style="margin:28px 0 0;font-size:12px;color:#999">
      Sent via the TantraStack website contact form. Reply directly to this email to respond to ${escapeHtml(name.trim())}.
    </p>
  </div>
</div>
`;

  const textBody = [
    "New project inquiry — TantraStack",
    "",
    `Name:         ${name.trim()}`,
    `Email:        ${email.trim()}`,
    `Project Type: ${projectType?.trim() || "Not specified"}`,
    `Budget Range: ${budget?.trim() || "Not specified"}`,
    "",
    "Message:",
    message.trim(),
  ].join("\n");

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"TantraStack Contact" <${process.env.GMAIL_USER}>`,
      to: recipient,
      replyTo: `"${name.trim()}" <${email.trim()}>`,
      subject: `New inquiry from ${name.trim()} — ${projectType?.trim() || "TantraStack"}`,
      text: textBody,
      html: htmlBody,
    });

    logger.info({ name, email, projectType }, "Contact form email sent");
    res.status(200).json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to send contact form email");
    res.status(500).json({
      error:
        "Failed to send your message. Please email us directly at we.tantra.stack@gmail.com.",
    });
  }
});

/** Minimal HTML escaping to prevent XSS in email body */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default contactRouter;
