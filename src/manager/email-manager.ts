import {emailAdapter} from "../adapters/email-adapter";

class EmailManager {
    async sendEmailAndConfirm(email: string, confirm: string) {
        return await emailAdapter.sendEmailRegistration(email, confirm);
    };

    async sendEmailPasswordRecovery(email: string, confirm: string) {
        return await emailAdapter.sendEmailPasswordRecovery(email, confirm);
    };
}

export const emailManager = new EmailManager();