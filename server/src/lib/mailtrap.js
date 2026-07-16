import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
import { welcomeTemplate } from "../template/welcome.template.js";
import { verificationTemplate } from "../template/verification.template.js";
import { AppError } from "../utils/responseHandler.js";
import { forgotPasswordTemplate } from "../template/forgotPassword.template.js";
dotenv.config();

const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Shopify Integration Test",
};

export const sendVerificationEmail = async (email, name, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: verificationTemplate(name, verificationToken),
      category: "Email Verification",
    });
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to Shopify",
      html: welcomeTemplate(name),
      category: "Welcome Email",
    });
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  const recipient = [{ email }];
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Shopify Request Reset Password",
      html: forgotPasswordTemplate(name, resetUrl),
      category: "Forgot Password",
    });
  } catch (error) {
    console.error(error);
    throw new AppError(error.message, 500);
  }
};
