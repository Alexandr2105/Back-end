import {usersCollection, UsersType} from "../db/db";

const options = {projection: {_id: 0, password: 0}};

export const usersRepository = {
    async creatNewUsers(newUser: UsersType): Promise<UsersType> {
        await usersCollection.insertOne(newUser);
        return newUser;
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async findLoginOrEmail(logOrEmail: string) {
        return await usersCollection.findOne({$or: [{login: logOrEmail}, {email: logOrEmail}]});
    },
    async getUserId(id: string) {
        return usersCollection.findOne({id: id}, options);
    }
}