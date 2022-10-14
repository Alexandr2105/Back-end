import {UsersType} from "../db/db";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";

export const usersService = {
    async creatNewUsers(login: string, email: string, password: string): Promise<UsersType> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this.generateHash(password, passwordSalt);
        const newUser = {
            id: +new Date() + "",
            login: login,
            password: passwordHash,
            email: email,
            createdAt: new Date().toISOString(),
        }
        await usersRepository.creatNewUsers(newUser);
        return newUser;
    },
    async checkUserOrLogin(loginOrEmail: string, pass: string): Promise<UsersType | boolean> {
        const user = await usersRepository.findLoginOrEmail(loginOrEmail)
        if (!user) return false;
        const hashPassword = await this.generateHash(pass, user.password);
        if (user.password === hashPassword) {
            return user;
        } else {
            return false;
        }
    },
    async generateHash(pass: string, salt: string) {
        return bcrypt.hash(pass, salt);
    },
    async getUserById(id: string) {
        return usersRepository.getUserId(id);
    },
    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id);
    }
}