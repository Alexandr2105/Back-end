import {blogsCollection} from "../db/db";
import {postsRepository, PostsType} from "../repositories/posts-repository";

const option = {projection: {_id: 0}};

export const postsService = {
    getAllPosts() {
        return postsRepository.getAllPosts();
    },
    getPostId(id: string) {
        return postsRepository.getPostId(id);
    },
    deletePostId(id: string) {
        return postsRepository.deletePostId(id);
    },
    updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string) {
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
        return await postsRepository.createPost(newPost);
    }
};