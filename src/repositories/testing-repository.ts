import {videos} from "./video-repository";
import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    registrationUsersCollection,
    usersCollection
} from "../db/db";

export const testingRepository = {
    deleteAllCollection() {
        videos.length = 0;
        blogsCollection.deleteMany({});
        postsCollection.deleteMany({});
        usersCollection.deleteMany({});
        commentsCollection.deleteMany({});
        registrationUsersCollection.deleteMany({});
    },
};