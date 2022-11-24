import {postsCollection} from "../db/db";
import {ItemsPosts} from "../helper/allTypes";

export const postsRepository = {
    async getPostId(id: string): Promise<ItemsPosts | boolean> {
        const blog = await postsCollection.findOne({id: id});
        if (blog) {
            return {
                id: blog.id,
                title: blog.title,
                shortDescription: blog.shortDescription,
                content: blog.content,
                blogId: blog.blogId,
                blogName: blog.blogName,
                createdAt: blog.createdAt
            }
        } else {
            return false;
        }
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
    }
};