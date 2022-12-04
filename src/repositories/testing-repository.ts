import {
    blogsCollection,
    commentsCollection,
    countAttemptCollection, likeInfoCollection,
    postsCollection,
    refreshTokenDataCollection,
    registrationUsersCollection,
    usersCollection
} from "../db/db";
import {injectable} from "inversify";

@injectable()
export class TestingRepository {
    async deleteAllCollection() {
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