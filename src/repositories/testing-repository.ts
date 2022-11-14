import {videos} from "./video-repository";
import {
    blogsCollection,
    commentsCollection,
    countAttemptCollection,
    postsCollection,
    refreshTokenDataCollection,
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
        refreshTokenDataCollection.deleteMany({});
        countAttemptCollection.deleteMany({});
    },
};