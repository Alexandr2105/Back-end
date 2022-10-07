import {blogsCollection, postsCollection, usersCollection} from "../db/db";

type ItemsBlogs = {
    id: string,
    youtubeUrl: string,
    name: string,
    createdAt: string,
}

type BlogsQueryType = {
    pagesCount: number,
    pageSize: number,
    page: number,
    totalCount: number,
    items: ItemsBlogs[]
};

type ItemsPosts = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
};

type PostQueryType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ItemsPosts[]
};

type ItemsUsers = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

type UsersType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ItemsUsers[]
}


export const queryRepository = {
    async getQueryBlogs(query: any): Promise<BlogsQueryType> {
        const sortBy = query.sortBy === undefined || query.sortBy === "" ? "createdAt" : query.sortBy;
        const searchNameTerm = query.searchNameTerm === undefined ? "" : query.searchNameTerm;
        const sortDirection = query.sortDirection === "" || query.sortDirection === undefined ? "desc" : query.sortDirection;
        const pageNumber = query.pageNumber <= 0 || isNaN(query.pageNumber) ? 1 : +query.pageNumber;
        const pageSize = query.pageSize <= 0 || isNaN(query.pageSize) ? 10 : +query.pageSize;
        const totalCount = await blogsCollection.countDocuments({
            name: {
                $regex: searchNameTerm,
                $options: 'i'
            }
        })
        const sortedBlogsArray = await blogsCollection.find({
            name: {
                $regex: searchNameTerm,
                $options: 'i'
            }
        }).sort(sortBy, sortDirection).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray();
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: sortedBlogsArray.map(a => {
                return {
                    id: a.id,
                    name: a.name,
                    youtubeUrl: a.youtubeUrl,
                    createdAt: a.createdAt,
                }
            })
        }
    },

    async getQueryPosts(query: any): Promise<PostQueryType> {
        const page = isNaN(query.pageNumber) || query.pageNumber <= 0 ? 1 : +query.pageNumber;
        const pageSize = isNaN(query.pageSize) || query.pageSize <= 0 ? 10 : +query.pageSize;
        const sortBy = query.sortBy === undefined || query.sortBy === "" ? "createdAt" : query.sortBy;
        const sortDirection = query.sortDirection === undefined || query.sortBy === "" ? "desc" : query.sortDirection;
        const sortPostsArray = await postsCollection.find({}).sort(sortBy, sortDirection).skip((page - 1) * pageSize).limit(+pageSize).toArray();
        const totalCount = await postsCollection.countDocuments({});
        const pageCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pageCount,
            page: page,
            pageSize: pageSize,
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
        const pageNumber = query.pageNumber <= 0 || isNaN(query.pageNumber) ? 1 : +query.pageNumber;
        const pageSize = query.pageSize <= 0 || isNaN(query.pageSize) ? 10 : +query.pageSize;
        const pagesCount = Math.ceil(totalCount / pageSize);
        const sortBy = query.sortBy === "" || query.sortBy === undefined ? "createdAt" : query.sortBy;
        const sortDirection = query.sortDirection === "" || query.sortDirection === undefined ? "desc" : query.sortDirection;
        const sortPostsId = await postsCollection.find({blogId: blogId}).sort(sortBy, sortDirection).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray();
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
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
        const searchLoginTerm = query.searchLoginTerm === "" || query.searchLoginTerm === undefined ? "" : query.searchLoginTerm;
        const searchEmailTerm = query.searchEmailTerm === "" || query.searchEmailTerm === undefined ? "" : query.searchEmailTerm;
        const pageNumber = query.pageNumber <= 0 || isNaN(query.pageNumber) ? 1 : +query.pageNumber;
        const pageSize = query.pageSize <= 0 || isNaN(query.pageSize) ? 10 : +query.pageSize;
        const sortBy = query.sortBy === "" || query.sortBy === undefined ? "createdAt" : query.sortBy;
        const sortDirection = query.sortDirection === "" || query.sortDirection === undefined ? "desc" : query.sortDirection;
        const totalCount = await usersCollection.countDocuments({
            $or: [{login: {$regex: searchLoginTerm, $options: "i"}}, {email: {$regex: searchEmailTerm, $options: "i"}}]
        });
        const pagesCount = Math.ceil(totalCount / pageSize);
        const sortArrayUsers = await usersCollection.find({
            $or: [{login: {$regex: searchLoginTerm, $options: "i"}}, {email: {$regex: searchEmailTerm, $options: "i"}}]
        }).skip((pageNumber - 1) * pageSize).limit(pageSize).sort(sortBy, sortDirection).toArray();
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
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
    }
}