import {MongoClient} from "mongodb";
import 'dotenv/config'

export type BlogsType = {
    id: string,
    name: string,
    youtubeUrl: string,
    createdAt: string,
};

export type PostsType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
};

export type UserType = {
    id: string,
    login: string,
    password: string,
    email: string,
    createdAt: string
};

export type CommentType = {
    id: string,
    idPost: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string
};

export type EmailConfirmation = {
    userId: string
    confirmationCode: any,
    expirationDate: Date,
    isConfirmed: boolean,
};

export type RefreshTokenData = {
    iat: string,
    exp: string,
    deviceId: string,
    ip: string,
    deviceName: string | undefined,
    userId: string
};

export type CountAttemptType = {
    ip: string,
    iat: string,
    countAttempt: number
};

const mongoUri = process.env.mongoUri || 'mongodb://0.0.0.0:27017';

const client = new MongoClient(mongoUri);
const db = client.db("tube");
export const blogsCollection = db.collection<BlogsType>("blogs");
export const postsCollection = db.collection<PostsType>("posts");
export const usersCollection = db.collection<UserType>("users");
export const commentsCollection = db.collection<CommentType>("comments");
export const registrationUsersCollection = db.collection<EmailConfirmation>("emailConfirmation");
export const refreshTokenDataCollection = db.collection<RefreshTokenData>("refreshTokenData");
export const countAttemptCollection = db.collection<CountAttemptType>("countAttempts");

export async function runDb() {
    try {
        await client.connect();
        await client.db("tube").command({ping: 1});
        console.log("Подключились к монго серверу");
    } catch {
        console.log("Нет подключения к БД");
        await client.close();
    }
}