import {postsRepository} from "../repositories/posts-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {blogsService} from "./blogs-service";
import {CommentsTypeForDB, ItemsPosts} from "../helper/allTypes";

export const postsService = {
    async getPostId(id: string, userId: string) {
        const post = await postsRepository.getPostId(id);
        const likeStatus: any = await commentsRepository.getLikesInfo(id);
        const dislikeStatus: any = await commentsRepository.getDislikeInfo(id);
        const myStatus: any = await commentsRepository.getMyStatus(userId, id);
        if (post) {
            return {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likeStatus,
                    dislikesCount: dislikeStatus,
                    myStatus: myStatus,
                }
            }
        } else {
            return false;
        }
    },
    async deletePostId(id: string): Promise<boolean> {
        return await postsRepository.deletePostId(id);
    },
    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postsRepository.updatePostId(id, title, shortDescription, content, blogId);
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<ItemsPosts> {
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
    async creatNewCommentByPostId(postId: string, content: string, userId: string, userLogin: string): Promise<CommentsTypeForDB | boolean> {
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
            return await commentsRepository.createComment(newComment);
        } else {
            return false;
        }
    },
    async createLikeStatus(postId: string, userId: string, likeStatus: string): Promise<boolean> {
        const newLikeStatusForPost = {
            id: postId,
            userId: userId,
            status: likeStatus,
            createDate: new Date().toISOString()
        }
        return await postsRepository.createLikeStatus(newLikeStatusForPost);
    }
};