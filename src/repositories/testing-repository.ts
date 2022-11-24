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
        blogsCollection.remove();
        postsCollection.remove();
        usersCollection.remove();
        commentsCollection.remove();
        registrationUsersCollection.remove();
        refreshTokenDataCollection.remove();
        countAttemptCollection.remove();
    },
};