import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../db/db";
import {BlogsQueryType, CommentsType, PostQueryType, UsersType} from "../helper/allTypes";
import {pagesCountHelper, skipHelper} from "../helper/queryCount";

export const queryRepository = {
    async getQueryBlogs(query: any): Promise<BlogsQueryType> {
        const totalCount = await blogsCollection.countDocuments({
            name: {
                $regex: query.searchNameTerm,
                $options: 'i'
            }
        })
        const sortedBlogsArray = await blogsCollection.find({
            name: {
                $regex: query.searchNameTerm,
                $options: 'i'
            }
        }).sort(query.sortBy, query.sortDirection).skip(skipHelper(query.pageNumber, query.pageSize)).limit(query.pageSize).toArray();
        return {
            pagesCount: pagesCountHelper(totalCount, query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: totalCount,
            items: sortedBlogsArray.map(a => {
                return {
                    id: a.id,
                    name: a.name,
                    description: a.description,
                    websiteUrl: a.websiteUrl,
                    createdAt: a.createdAt,
                }
            })
        }
    },

    async getQueryPosts(query: any): Promise<PostQueryType> {
        const sortPostsArray = await postsCollection.find({}).sort(query.sortBy, query.sortDirection).skip(skipHelper(query.pageNumber, query.pageSize)).limit(+query.pageSize).toArray();
        const totalCount = await postsCollection.countDocuments({});
        return {
            pagesCount: pagesCountHelper(totalCount, query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: totalCount,
            items: sortPostsArray.map(a => {
                return {
                    id: a.id,
                    title: a.title,
                    shortDescription: a.shortDescription,
                    content: a.content,
                    blogId: a.blogId,
                    blogName: a.blogName,
                    createdAt: a.createdAt
                }
            })
        }
    },

    async getQueryPostsBlogsId(query: any, blogId: string): Promise<PostQueryType> {
        const totalCount = await postsCollection.countDocuments({blogId: blogId});
        const sortPostsId = await postsCollection.find({blogId: blogId}).sort(query.sortBy, query.sortDirection)
            .skip(skipHelper(query.pageNumber, query.pageSize)).limit(query.pageSize).toArray();
        return {
            pagesCount: pagesCountHelper(totalCount, query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: totalCount,
            items: sortPostsId.map(a => {
                return {
                    id: a.id,
                    title: a.title,
                    shortDescription: a.shortDescription,
                    content: a.content,
                    blogId: a.blogId,
                    blogName: a.blogName,
                    createdAt: a.createdAt,
                };
            })
        }
    },

    async getQueryUsers(query: any): Promise<UsersType> {
        const totalCount = await usersCollection.countDocuments({
            $or: [{login: {$regex: query.searchLoginTerm, $options: "i"}}, {
                email: {
                    $regex: query.searchEmailTerm,
                    $options: "i"
                }
            }]
        });
        const sortArrayUsers = await usersCollection.find({
            $or: [{login: {$regex: query.searchLoginTerm, $options: "i"}}, {
                email: {
                    $regex: query.searchEmailTerm,
                    $options: "i"
                }
            }]
        }).skip(skipHelper(query.pageNumber, query.pageSize)).limit(query.pageSize).sort(query.sortBy, query.sortDirection).toArray();
        return {
            pagesCount: pagesCountHelper(totalCount, query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: totalCount,
            items: sortArrayUsers.map(a => {
                return {
                    id: a.id,
                    login: a.login,
                    email: a.email,
                    createdAt: a.createdAt,
                }
            })
        }
    },

    async getQueryCommentsByPostId(query: any, postId: string): Promise<CommentsType | boolean> {
        const totalCount = await commentsCollection.countDocuments({idPost: postId});
        if (totalCount === 0) {
            return false;
        }
        const sortCommentsByPostId = await commentsCollection.find({idPost: postId}).sort(query.sortBy, query.sortDirection)
            .skip(skipHelper(query.pageNumber, query.pageSize)).limit(query.pageSize).toArray();
        return {
            pagesCount: pagesCountHelper(totalCount, query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: totalCount,
            items: sortCommentsByPostId.map(a => {
                return {
                    id: a.id,
                    content: a.content,
                    userId: a.userId,
                    userLogin: a.userLogin,
                    createdAt: a.createdAt
                }
            })
        }
    },
}