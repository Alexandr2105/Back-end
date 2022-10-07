import {usersCollection, UsersType} from "../db/db";

export const usersRepository = {
    async creatNewUsers(newUser: UsersType): Promise<UsersType> {
        await usersCollection.insertOne(newUser);
        return newUser;
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id});
        return result.deletedCount === 1;
    }
}