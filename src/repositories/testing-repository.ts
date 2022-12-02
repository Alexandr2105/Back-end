import {videosRepository} from "./videos-repository";
import {
    blogsCollection,
    commentsCollection,
    countAttemptCollection, likeInfoCollection,
    postsCollection,
    refreshTokenDataCollection,
    registrationUsersCollection,
    usersCollection
} from "../db/db";

class TestingRepository {
    async deleteAllCollection() {
        videosRepository.videos.length = 0;
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await usersCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        await registrationUsersCollection.deleteMany({});
        await refreshTokenDataCollection.deleteMany({});
        await countAttemptCollection.deleteMany({});
        await likeInfoCollection.deleteMany({});
    }
}

export const testingRepository = new TestingRepository();