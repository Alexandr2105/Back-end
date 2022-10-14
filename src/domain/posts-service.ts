import {blogsCollection, CommentType, PostsType} from "../db/db";
import {postsRepository} from "../repositories/posts-repository";
import {commentsRepository} from "../repositories/comments-repository";

export const postsService = {
    // async getAllPosts(): Promise<PostsType[]> {
    //     return postsRepository.getAllPosts();
    // },
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
        const a = await blogsCollection.findOne({id: blogId});
        const newPost = {
            id: +new Date() + "",
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: a!.name,
            createdAt: new Date().toISOString()
        }
        return postsRepository.createPost(newPost);
    },
    async creatNewCommentByPostId(postId: string, content: string, userId: string, userLogin: string): Promise<CommentType> {
        const newComment = {
            id: postId,
            content: content,
            userId: userId,
            userLogin: userLogin,
            createdAt: new Date().toISOString(),
        }
        return commentsRepository.createComment(newComment);
    }
    // async createPostForBlogId(title: string, shortDescription: string, content: string, blogId: string):Promise<PostsType>{
    //
    // }
};