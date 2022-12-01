import {postsRepository} from "../repositories/posts-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {blogsService} from "./blogs-service";
import {CommentsTypeForDB, ItemsPosts} from "../helper/allTypes";

export const postsService = {
    async getPostId(id: string, userId: string) {
        const post = await postsRepository.getPostId(id);
        const likesCount = await postsRepository.getLikesInfo(id);
        const dislikeCount: any = await postsRepository.getDislikeInfo(id);
        const myStatus: any = await postsRepository.getMyStatus(userId, id);
        const infoLikes = await postsRepository.getAllInfoLike(id);
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
                    likesCount: likesCount,
                    dislikesCount: dislikeCount,
                    myStatus: myStatus,
                    newestLikes: infoLikes.map(a => {
                            return {
                                addedAt: a.createDate,
                                userId: a.userId,
                                login: a.login
                            }
                        }
                    )
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
        const idPost = await postsRepository.getPostId(postId);
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
    async createLikeStatus(postId: string, userId: string, likeStatus: string, login: string): Promise<boolean> {
        const checkPost = await postsRepository.getInfoStatusByPost(postId, userId);
        if (checkPost) {
            return await postsRepository.updateStatusPost(postId, userId, likeStatus);
        } else {
            const newLikeStatusForPost = {
                id: postId,
                userId: userId,
                login: login,
                status: likeStatus,
                createDate: new Date().toISOString()
            }
            return await postsRepository.createLikeStatus(newLikeStatusForPost);
        }
    }
};