import {UsersType} from "../db/db";
import {usersRepository} from "../repositories/users-repository";

export const usersService = {
    async creatNewUsers(login: string, email: string): Promise<UsersType> {
        const newUser = {
            id: +new Date() + "",
            login: login,
            email: email,
            createdAt: new Date().toISOString(),
        }
        await usersRepository.creatNewUsers(newUser);
        return newUser;
    },
    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id);
    }
}