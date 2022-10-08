import {postsCollection, PostsType} from "../db/db";

const option = {projection: {_id: 0}};

export const postsRepository = {
    // async getAllPosts(): Promise<PostsType[]> {
    //     return postsCollection.find({}, option).toArray();
    // },
    async getPostId(id: string): Promise<PostsType | boolean> {
        const blog = await postsCollection.findOne({id: id}, option);
        if (blog) {
            return blog;
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
    async createPost(newPost: PostsType): Promise<PostsType> {
        await postsCollection.insertOne(newPost);
        return newPost;
    }
};