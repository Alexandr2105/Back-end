import {EmailAdapter} from "../adapters/email-adapter";

export class EmailManager {
    private emailAdapter: EmailAdapter;

    constructor() {
        this.emailAdapter = new EmailAdapter();
    };

    async sendEmailAndConfirm(email: string, confirm: string) {
        return await this.emailAdapter.sendEmailRegistration(email, confirm);
    };

    async sendEmailPasswordRecovery(email: string, confirm: string) {
        return await this.emailAdapter.sendEmailPasswordRecovery(email, confirm);
    };
}