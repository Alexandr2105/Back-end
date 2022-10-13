export type ItemsBlogs = {
    id: string,
    youtubeUrl: string,
    name: string,
    createdAt: string,
}

export type BlogsQueryType = {
    pagesCount: number,
    pageSize: number,
    page: number,
    totalCount: number,
    items: ItemsBlogs[]
};

export type ItemsPosts = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
};

export type PostQueryType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ItemsPosts[]
};

export type ItemsUsers = {
    id: string,
    login: string,
    email: string,
    createdAt: string
};

export type UsersType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ItemsUsers[]
};

type ItemsComments = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string
};

type CommentsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ItemsComments[]
};