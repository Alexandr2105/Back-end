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
            html: `<h1>Password recovery</h1>
                <p>To finish password recovery please follow the link below:
                <a href='https://somesite.com/password-recovery?recoveryCode=${confirm}'>recovery password</a>
                </p>`
            // html:`<h1>Thank for your registration</h1>
            //            <p>To finish registration please follow the link below:
            //               <a href='https://somesite.com/confirm-email?code=${confirm}'>complete registration</a>
            //             </p>`
        });
        return true;
    }
}

//     <h1>Password recovery</h1>
// <p>To finish password recovery please follow the link below:
//     <a href='https://somesite.com/password-recovery?recoveryCode=your_recovery_code'>recovery password</a>
// </p>
//
//
// <h1>Thank for your registration</h1>
// <p>To finish registration please follow the link below:
//     <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
// </p>