import {UsersType} from "../db/db";

declare global {
    declare namespace Express {
        export interface Request {
            user: UsersType | null;
        }
    }
}