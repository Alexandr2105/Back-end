import {registrationUsersCollection, usersCollection} from "../db/db";
import {add} from "date-fns";
import {EmailConfirmationTypeForDB, ItemsUsers} from "../helper/allTypes";

export const usersRepository = {
    async creatNewUsers(newUser: ItemsUsers): Promise<ItemsUsers> {
        await usersCollection.create(newUser);
        return newUser;
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async findLoginOrEmail(logOrEmail: string): Promise<ItemsUsers | null> {
        return usersCollection.findOne({$or: [{login: logOrEmail}, {email: logOrEmail}]});
    },
    async getUserId(id: string): Promise<ItemsUsers | boolean> {
        const user = await usersCollection.findOne({id: id});
        if (user) {
            return {
                id: user.id,
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }
        } else {
            return false
        }
    },
    async createEmailConfirmation(emailConf: EmailConfirmationTypeForDB) {
        await registrationUsersCollection.create(emailConf);
    },
    async updateEmailConfirmation(id: string): Promise<boolean> {
        const result = await registrationUsersCollection.updateOne({userId: id}, {$set: {isConfirmed: true}});
        return result.matchedCount === 1;
    },
    async getUserByCode(code: string) {
        const idUser = await registrationUsersCollection.findOne({confirmationCode: code});
        if (idUser) {
            return idUser;
        }
    },
    async setConfirm(email: string, newCode: string): Promise<boolean> {
        const user: any = await usersCollection.findOne({email: email});
        const checkUserEmailConfirmation = await registrationUsersCollection.findOne({userId: user?.id});
        if (checkUserEmailConfirmation) {
            const result = await registrationUsersCollection.updateOne({userId: user?.id}, {$set: {confirmationCode: newCode}});
            return result.matchedCount === 1;
        } else {
            await registrationUsersCollection.create({
                userId: user?.id,
                confirmationCode: newCode,
                expirationDate: add(new Date(), {hours: 1}),
                isConfirmed: false
            });
            return true;
        }
    },
    async updatePasswordUser(password: string, userId: string): Promise<boolean> {
        const newPass = await usersCollection.updateOne({id: userId}, {$set: {password: password}});
        return newPass.matchedCount === 1;
    }
}