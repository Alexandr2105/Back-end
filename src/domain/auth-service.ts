import {v4 as uuid4} from "uuid";
import {add} from "date-fns";
import {EmailConfirmation} from "../db/db";
import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../manager/email-manager";

export const authService = {
    async confirmation(id: string, login: string, email: string) {
        const emailConfirmation: EmailConfirmation = {
            userId: id,
            confirmationCode: uuid4(),
            expirationDate: add(new Date(), {hours: 1, minutes: 3}),
            isConfirmed: false,
        }
        await usersRepository.createEmailConfirmation(emailConfirmation);
        try {
            await emailManager.sendEmailAndConfirm(email, emailConfirmation.confirmationCode);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersRepository.getUserByCode(code);
        if (!user) return false;
        if (user.isConfirmed) return false;
        if (user.confirmationCode !== code) return false;
        if (user.expirationDate < new Date()) return false;
        return true;
    },
    async getNewConfirmationCode(email: string) {
        const newCode = uuid4();
        const updateCode = await usersRepository.setConfirm(email, newCode);
        if (updateCode) {
            return newCode;
        }
    }
};