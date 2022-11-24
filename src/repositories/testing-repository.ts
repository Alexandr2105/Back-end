import {videos} from "./video-repository";
import {
    blogsCollection,
    commentsCollection,
    countAttemptCollection, likeInfoCollection,
    postsCollection,
    refreshTokenDataCollection,
    registrationUsersCollection,
    usersCollection
} from "../db/db";

export const testingRepository = {
    async deleteAllCollection() {
        videos.length = 0;
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await usersCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        await registrationUsersCollection.deleteMany({});
        await refreshTokenDataCollection.deleteMany({});
        await countAttemptCollection.deleteMany({});
        await likeInfoCollection.deleteMany({});
    },
};