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
    login: {type: String, required: true},
    status: {type: String, required: true},
    createDate: {type: String, required: true}
});

const mongoUri = process.env.mongoUri || 'mongodb://0.0.0.0:27017/tube';

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
        await mongoose.connect(mongoUri);
        console.log("Подключились к монго серверу");
    } catch {
        console.log("Нет подключения к БД");
        await mongoose.disconnect();
    }
}