import {EmailAdapter} from "../adapters/email-adapter";
import {inject, injectable} from "inversify";

@injectable()
export class EmailManager {

    constructor(@inject(EmailAdapter) protected emailAdapter: EmailAdapter) {
    };

    async sendEmailAndConfirm(email: string, confirm: string) {
        return await this.emailAdapter.sendEmailRegistration(email, confirm);
    };

    async sendEmailPasswordRecovery(email: string, confirm: string) {
        return await this.emailAdapter.sendEmailPasswordRecovery(email, confirm);
    };
}