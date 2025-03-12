import MailForm from "@/components/MailForm";
import { getErrorMessage } from "@/lib/error";
import { mailFormSchema } from "@/lib/formValidationSchemas";
import { compileWelcomeTemplate } from "@/lib/mail";
import { welcomeTemplate } from "@/lib/templates/welcome";
import { MailFormData } from "@/types/mail-form";
import { FormData } from "@/types/mailForm";
import nodemailer from "nodemailer";

export default async function Invite() {
  const sendMail = async (formData: FormData) => {
    "use server";

    try {
      // Validate the data
      mailFormSchema.parse(formData);

      // Nodemailer setup
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // const mailOptions = {
      //   from: formData.email,
      //   to: process.env.MAIL_RECEIVER_ADDRESS,
      //   subject: formData.subject,
      //   text: formData.message,
      //   html: "",
      // };

      const mailOptions = {
        from: formData.email,
        to: formData.email,
        subject: formData.subject,
        text: formData.message,
        html: compileWelcomeTemplate(formData.name, "youtube"),
      };

      // Send email
      await transporter.sendMail(mailOptions);
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  };

  return <MailForm sendMail={sendMail} />;
}
