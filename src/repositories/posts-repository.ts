import {blogs} from "./blogs-repository";

type PostsType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export const posts: PostsType[] = [
    {
        "id": "1",
        "title": "qwer",
        "shortDescription": "asdf asf",
        "content": "qwer",
        "blogId": "1",
        "blogName": "qwer"

    }, {
        "id": "2",
        "title": "asdf",
        "shortDescription": "adf adsf",
        "content": "asdf",
        "blogId": "2",
        "blogName": "adf"

    }, {
        "id": "3",
        "title": "zccv",
        "shortDescription": "zxcv zxcv",
        "content": "zxcv",
        "blogId": "3",
        "blogName": "zxcv"

    },
];

export const postsRepository = {
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
                post.blogId = blogId
                return 204;
            }
        }
        return 404;
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string) {
        let name = "string";
        for (let blog of blogs) {
            if (blog.id === blogId) {
                name = blog.name.toString()
            }
        }

        const newPost = {
            id: +new Date() + "",
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: name
        }
        posts.push(newPost);
        return newPost;
    }
};