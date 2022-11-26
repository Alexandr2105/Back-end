// import {MongoClient} from "mongodb";
import 'dotenv/config';
import mongoose from "mongoose";
import {
    CommentsTypeForDB, CountAttemptTypeForDB,
    EmailConfirmationTypeForDB,
    ItemsBlogs,
    ItemsPosts, LikeInfoTypeForDB,
    RefreshTokenDataTypeForDB,
    UserTypeForDB
} from "../helper/allTypes";

// export type BlogsType = {
//     id: string,
//     name: string,
//     description: string,
//     websiteUrl: string,
//     createdAt: string,
// };
//
// export type PostsType = {
//     id: string,
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//     blogName: string,
//     createdAt: string
// };
//
// export type UserType = {
//     id: string,
//     login: string,
//     password: string,
//     email: string,
//     createdAt: string
// };
//
// export type CommentType = {
//     id: string,
//     idPost: string,
//     content: string,
//     userId: string,
//     userLogin: string,
//     createdAt: string
// };
//
// export type EmailConfirmation = {
//     userId: string
//     confirmationCode: any,
//     expirationDate: Date,
//     isConfirmed: boolean,
// };
//
// export type RefreshTokenData = {
//     iat: number,
//     exp: number,
//     deviceId: string,
//     ip: string,
//     deviceName: string | undefined,
//     userId: string
// };
//
// export type CountAttemptType = {
//     ip: string,
//     iat: number,
//     method: string,
//     originalUrl: string,
//     countAttempt: number
// };
//
// export type LikeInfoType = {
//     commentId: string,
//     userId: string,
//     status: string
// };
export const BlogsType = new mongoose.Schema<ItemsBlogs>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true}
});
export const PostsType = new mongoose.Schema<ItemsPosts>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
});
export const CommentsType = new mongoose.Schema<CommentsTypeForDB>({
    id: {type: String, required: true},
    idPost: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: String, required: true},
});
export const UserType = new mongoose.Schema<UserTypeForDB>({
    id: {type: String, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true}
});
export const EmailConfirmationType = new mongoose.Schema<EmailConfirmationTypeForDB>({
    userId: {type: String, required: true},
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true}
});
export const RefreshTokenDataType = new mongoose.Schema<RefreshTokenDataTypeForDB>({
    iat: {type: Number, required: true},
    exp: {type: Number, required: true},
    deviceId: {type: String, required: true},
    ip: {type: String, required: true},
    deviceName: {type: String, required: true},
    userId: {type: String, required: true}
});
export const CountAttemptType = new mongoose.Schema<CountAttemptTypeForDB>({
    ip: {type: String, required: true},
    iat: {type: Number, required: true},
    method: {type: String, required: true},
    originalUrl: {type: String, required: true},
    countAttempt: {type: Number, required: true}
});
export const LikeInfoType = new mongoose.Schema<LikeInfoTypeForDB>({
    id: {type: String, required: true},
    userId: {type: String, required: true},
    status: {type: String, required: true},
    createDate: {type: String, required: true}
});

const mongoUri = process.env.mongoUri || 'mongodb://0.0.0.0:27017/tube';
// const client = new MongoClient(mongoUri);
// const db = client.db("tube");
// export const blogsCollection = db.collection<BlogsType>("blogs");
// export const postsCollection = db.collection<PostsType>("posts");
// export const usersCollection = db.collection<UserType>("users");
// export const commentsCollection = db.collection<CommentType>("comments");
// export const registrationUsersCollection = db.collection<EmailConfirmation>("emailConfirmation");
// export const refreshTokenDataCollection = db.collection<RefreshTokenData>("refreshTokenData");
// export const countAttemptCollection = db.collection<CountAttemptType>("countAttempts");
// export const likeInfoCollection = db.collection<LikeInfoType>("likeStatus");

export const blogsCollection = mongoose.model("blogs", BlogsType);
export const postsCollection = mongoose.model("posts", PostsType);
export const commentsCollection = mongoose.model("comments", CommentsType);
export const usersCollection = mongoose.model("users", UserType);
export const registrationUsersCollection = mongoose.model("emailConfirmation", EmailConfirmationType);
export const refreshTokenDataCollection = mongoose.model("refreshTokenData", RefreshTokenDataType);
export const countAttemptCollection = mongoose.model("countAttempts", CountAttemptType);
export const likeInfoCollection = mongoose.model("likeStatus", LikeInfoType);

export async function runDb() {
    try {
        // await client.connect();
        await mongoose.connect(mongoUri);
        // await client.db("tube").command({ping: 1});
        console.log("Подключились к монго серверу");
    } catch {
        console.log("Нет подключения к БД");
        // await client.close();
        await mongoose.disconnect();
    }
}