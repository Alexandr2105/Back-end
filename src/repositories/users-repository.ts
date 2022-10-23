import {EmailConfirmation, registrationUsersCollection, usersCollection, UserType} from "../db/db";

const options = {projection: {_id: 0, password: 0}};

export const usersRepository = {
    async creatNewUsers(newUser: UserType): Promise<UserType> {
        await usersCollection.insertOne(newUser);
        return newUser;
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async findLoginOrEmail(logOrEmail: string): Promise<UserType | null> {
        return await usersCollection.findOne({$or: [{login: logOrEmail}, {email: logOrEmail}]});
    },
    async getUserId(id: string) {
        return await usersCollection.findOne({id: id}, options);
    },
    async createEmailConfirmation(emailConf: EmailConfirmation) {
        await registrationUsersCollection.insertOne(emailConf);
    },
    async updateEmailConfirmation(id: string) {
        const result = await registrationUsersCollection.updateOne({userId: id}, {$set: {isConfirmed: true}});
        return result.matchedCount === 1;
    },
    async getUserByCode(code: string) {
        const idUser = await registrationUsersCollection.findOne({confirmationCode: code});
        if (idUser) {
            return idUser;
        }
    },
    async getConfirmationId(id: string) {
        const confirmation = await registrationUsersCollection.findOne({userId: id});
        if (confirmation) {
            return confirmation.isConfirmed;
        }
    },
    async getConfirmationCodeByEmail(email: string) {
        const user = await usersCollection.findOne({email: email});
        const regUser = await registrationUsersCollection.findOne({userId: user?.id});
        return regUser?.confirmationCode;
    }
}