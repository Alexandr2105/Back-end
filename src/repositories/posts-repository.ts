import {likeInfoCollection, postsCollection} from "../db/db";
import {ItemsPosts, LikeInfoTypeForDB} from "../helper/allTypes";

export const postsRepository = {
    async getPostId(id: string): Promise<ItemsPosts | null> {
        return postsCollection.findOne({id: id});
    },
    async deletePostId(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const updatePost = await postsCollection.updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
            },
        });
        return updatePost.matchedCount === 1;
    },
    async createPost(newPost: ItemsPosts): Promise<ItemsPosts> {
        await postsCollection.create(newPost);
        return newPost;
    },
    async createLikeStatus(likeStatus: LikeInfoTypeForDB): Promise<boolean> {
        const status = await likeInfoCollection.create(likeStatus);
        return !!status;
    }
};