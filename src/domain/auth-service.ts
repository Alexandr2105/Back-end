import {v4 as uuid4} from "uuid";
import {add} from "date-fns";
import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../manager/email-manager";
import {EmailConfirmationTypeForDB} from "../helper/allTypes";

class AuthService {
    async confirmation(id: string, login: string, email: string) {
        const emailConfirmation = new EmailConfirmationTypeForDB(id, uuid4(), add(new Date(), {
            hours: 1,
            minutes: 3
        }), false);
        await usersRepository.createEmailConfirmation(emailConfirmation);
        try {
            await emailManager.sendEmailAndConfirm(email, emailConfirmation.confirmationCode);
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersRepository.getUserByCode(code);
        if (!user) return false;
        if (user.isConfirmed) return false;
        if (user.confirmationCode !== code) return false;
        if (user.expirationDate < new Date()) return false;
        return await usersRepository.updateEmailConfirmation(user.userId);
    };

    async confirmRecoveryCode(code: string): Promise<boolean> {
        const user = await usersRepository.getUserByCode(code);
        if (!user) return false;
        if (user.isConfirmed) return false;
        if (user.confirmationCode !== code) return false;
        return user.expirationDate >= new Date();

    };

    async getNewConfirmationCode(email: string) {
        const newCode = uuid4();
        const updateCode = await usersRepository.setConfirm(email, newCode);
        if (updateCode) {
            return newCode;
        }
    };
}

export const authService = new AuthService();