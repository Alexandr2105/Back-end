import {videos} from "./video-repository";
import {
    blackListCollection,
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
        blackListCollection.deleteMany({});
    },
};