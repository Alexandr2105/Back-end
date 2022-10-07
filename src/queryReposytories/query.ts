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
        const pageNumber = query.pageNumber <= 0 ? 1 : +query.pageNumber;
        const pageSize = query.pageSize <= 0 ? 10 : +query.pageSize;
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
        const page = query.pageNumber <= 0 ? 1 : +query.pageNumber;
        const pageSize = query.pageSize <= 0 ? 10 : +query.pageSize;
        const sortBy = query.sortBy === "" ? "createdAt" : query.sortBy;
        const sortDirection = query.sortDirection === "" ? "desc" : query.sortDirection;
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
        const pageNumber = query.pageNumber <= 0 ? 1 : +query.pageNumber;
        const pageSize = query.pageSize <= 0 ? 10 : +query.pageSize;
        const pagesCount = Math.ceil(totalCount / pageSize);
        const sortBy = query.sortBy === "" ? "createdAt" : query.sortBy;
        const sortDirection = query.sortDirection === "" ? "desc" : query.sortDirection;
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
                    blogName: a.blogId,
                    createdAt: a.createdAt,
                };
            })
        }
    }
};