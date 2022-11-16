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
            subject: "Password recovery",
            html:`<h1>Password recovery</h1>
                       <p>To finish password recovery please follow the link below:
                          <a href='https://somesite.com/confirm-email?code=${confirm}'>recovery password</a>
                        </p>`
        });
        return true;
    }
}