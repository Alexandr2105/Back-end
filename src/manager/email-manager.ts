import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailAndConfirm(email: string, confirm: string) {
        return await emailAdapter.sendEmailRegistration(email, confirm);
    },
    async sendEmailPasswordRecovery(email: string, confirm: string) {
        return await emailAdapter.sendEmailPasswordRecovery(email, confirm);
    }
}