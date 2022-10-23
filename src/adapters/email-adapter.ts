import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmailRegistration(email: string, confirm: string) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "testnodemaileremail@gmail.com",
                pass: "nfzdgxtapolqzxvo",
            },
        });

        const info = await transporter.sendMail({
            from: 'Alex <testnodemaileremail@gmail.com>',
            to: email,
            subject: "Registration",
            text: "Finish registration",
            html: `<h1>Thank for your registration</h1>\n` +
                `       <p>To finish registration please follow the link below:\n` +
                `          'https://somesite.com/confirm-email?code=${confirm}\n` +
                `      </p>\n`,

            //http://localhost:3000/auth/registration-confirmation?code=your_confirmation_code
        });
        return true;

    }
}