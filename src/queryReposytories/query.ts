import {blogsCollection, postsCollection} from "../db/db";

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

export const queryRepository = {
    async getQueryBlogs(query: any): Promise<BlogsQueryType> {
        const sortBy = query.sortBy.length > 0 ? query.sortBy : "createdAt";
        const searchNameTerm = query.searchNameTerm.length === null ? "" : query.searchNameTerm;
        const sortDirection = query.sortDirection === "" ? "desc" : query.sortDirection;
        const pageNumber = query.pageNumber <= 0 ? 1 : query.pageNumber;
        const pageSize = query.pageSize <= 0 ? 10 : query.pageSize;
        const arrayBlogs = await blogsCollection.find({
            name: {
                $regex: searchNameTerm,
                $options: 'i'
            }
        }).sort(sortBy, sortDirection);
        const totalCount = await arrayBlogs.count();
        const sortedBlogsArray = await arrayBlogs.skip((pageNumber - 1) * pageSize).limit(+pageSize).toArray();
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
        const page = query.pageNumber <= 0 ? 1 : query.pageNumber;
        const pageSize = query.pageSize <= 0 ? 10 : query.pageSize;
        const sortBy = query.sortBy === "" ? "createdAt" : query.sortBy;
        const sortDirection = query.sortDirection === "" ? "desc" : query.sortDirection;
        const postsArray = postsCollection.find({}).sort(sortBy, sortDirection)
        const totalCount = await postsArray.count();
        const pageCount = Math.ceil(totalCount / pageSize);
        const sortPostsArray = await postsArray.skip((page - 1) * pageSize).limit(+pageSize).toArray();
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
    }
};