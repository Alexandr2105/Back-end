import {blogsCollection, PostsType} from "../db/db";
import {postsRepository} from "../repositories/posts-repository";

const option = {projection: {_id: 0}};

export const postsService = {
    // async getAllPosts(): Promise<PostsType[]> {
    //     return postsRepository.getAllPosts();
    // },
    async getPostId(id: string): Promise<PostsType | boolean> {
        return postsRepository.getPostId(id);
    },
    async deletePostId(id: string): Promise<boolean> {
        return postsRepository.deletePostId(id);
    },
    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return postsRepository.updatePostId(id, title, shortDescription, content, blogId);
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType> {
        let name = "string";
        const a = await blogsCollection.findOne({id: blogId}, option);
        if (a?.id === blogId) {
            name = a.name;
        }
        const newPost = {
            id: +new Date() + "",
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: name,
            createdAt: new Date().toISOString()
        }
        return postsRepository.createPost(newPost);
    }
};