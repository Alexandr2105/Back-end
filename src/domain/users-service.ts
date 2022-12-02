import bcrypt from "bcrypt";
import {ItemsUsers, UserTypeForDB} from "../helper/allTypes";
import {UsersRepository} from "../repositories/users-repository";

export class UsersService {
    private usersRepository: UsersRepository;

    constructor() {
        this.usersRepository = new UsersRepository();
    };

    async creatNewUsers(login: string, email: string, password: string): Promise<ItemsUsers> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this.generateHash(password, passwordSalt);
        const newUser = new UserTypeForDB(+new Date() + "", login, passwordHash, email, new Date().toISOString());
        await this.usersRepository.creatNewUsers(newUser);
        return newUser;
    };

    async checkUserOrLogin(loginOrEmail: string, pass: string): Promise<ItemsUsers | boolean> {
        const user: any = await this.usersRepository.findLoginOrEmail(loginOrEmail);
        if (!user) return false;
        const hashPassword = await this.generateHash(pass, user.password);
        if (user.password === hashPassword) {
            return user;
        } else {
            return false;
        }
    };

    async generateHash(pass: string, salt: string) {
        return bcrypt.hash(pass, salt);
    };

    async getUserById(id: string) {
        return this.usersRepository.getUserId(id);
    };

    async deleteUser(id: string): Promise<boolean> {
        return this.usersRepository.deleteUser(id);
    };

    async createNewPassword(newPassword: string, userId: string) {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this.generateHash(newPassword, passwordSalt);
        return await this.usersRepository.updatePasswordUser(passwordHash, userId);
    };
}