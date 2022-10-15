import {CommentType, PostsType} from "../db/db";
import {postsRepository} from "../repositories/posts-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {blogsService} from "./blogs-service";

export const postsService = {
    async getPostId(id: string): Promise<PostsType | boolean> {
        return await postsRepository.getPostId(id);
    },
    async deletePostId(id: string): Promise<boolean> {
        return await postsRepository.deletePostId(id);
    },
    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postsRepository.updatePostId(id, title, shortDescription, content, blogId);
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType> {
        // const a = await blogsCollection.findOne({id: blogId});
        const post: any = await blogsService.getBlogsId(blogId);
        const newPost = {
            id: +new Date() + "",
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: post!.name,
            createdAt: new Date().toISOString()
        }
        return postsRepository.createPost(newPost);
    },
    async creatNewCommentByPostId(postId: string, content: string, userId: string, userLogin: string): Promise<CommentType | boolean> {
        // const idPost = await postsCollection.findOne({id: postId});
        const idPost = await postsService.getPostId(postId);
        if (idPost) {
            const newComment = {
                id: +new Date() + "",
                idPost: postId,
                content: content,
                userId: userId,
                userLogin: userLogin,
                createdAt: new Date().toISOString(),
            }
            return commentsRepository.createComment(newComment);
        } else {
            return false;
        }
    }
};