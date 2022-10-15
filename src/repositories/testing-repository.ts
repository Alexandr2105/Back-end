import {videos} from "./video-repository";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../db/db";

export const testingRepository = {
    deleteAllVideo() {
        videos.length = 0;
        //blogs.length = 0;
        //posts.length = 0;
        blogsCollection.deleteMany({});
        postsCollection.deleteMany({});
        usersCollection.deleteMany({});
        commentsCollection.deleteMany({});
    },
}