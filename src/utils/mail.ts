import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationToken = async (email: string, token: string) => {
  const verificationUrl = `${process.env.DOMAIN}/verify?token=${token}`;
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `
        <div>
            <h1>Welcome to our service!</h1>
            <p>To complete your registration, please verify your email address by clicking the link below:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>If you did not create an account, you can ignore this email.</p>
            <p>Thank you!</p>
        </div>`,
  });
};
