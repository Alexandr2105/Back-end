export type PostsType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    "createdAt": string
}
export const posts: PostsType[] = [
    {
        "id": "1",
        "title": "qwer",
        "shortDescription": "asdf asf",
        "content": "qwer",
        "blogId": "1",
        "blogName": "qwer",
        "createdAt": new Date().toISOString()
    }, {
        "id": "2",
        "title": "asdf",
        "shortDescription": "adf adsf",
        "content": "asdf",
        "blogId": "2",
        "blogName": "adf",
        "createdAt": new Date().toISOString()
    }, {
        "id": "3",
        "title": "zccv",
        "shortDescription": "zxcv zxcv",
        "content": "zxcv",
        "blogId": "3",
        "blogName": "zxcv",
        "createdAt": new Date().toISOString()
    },
];

export const postsInMemoryRepository = {
    getAllPosts() {
        return posts;
    },
    getPostId(id: string) {
        for (let post of posts) {
            if (post.id === id) {
                return post;
            }
        }
        return false;
    },
    deletePostId(id: string) {
        for (let a = 0; a < posts.length; a++) {
            if (posts[a].id === id) {
                posts.splice(a, 1);
                return true;
            }
        }
        return false;
    },
    updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        for (let post of posts) {
            if (post.id === id) {
                post.title = title;
                post.shortDescription = shortDescription;
                post.content = content;
                post.blogId = blogId;
                post.createdAt;
                return true;
            }
        }
        return false;
    },
    async createPost(newPost: PostsType): Promise<PostsType> {
        posts.push(newPost);
        return newPost;
    }
};