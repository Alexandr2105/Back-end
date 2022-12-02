class PostsType {

    constructor(public id: string,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string) {
    }
}

export class PostsInMemoryRepository {
    posts = [
        new PostsType("1", "qwer", "asdf asf", "qwer", "1", "qwer", new Date().toISOString()),
        new PostsType("2", "asdf", "adf adsf", "asdf", "2", "adf", new Date().toISOString()),
        new PostsType("3", "zccv", "zxcv zxcv", "zxcv", "3", "zxcv", new Date().toISOString())
    ];

    getAllPosts() {
        return this.posts;
    };

    getPostId(id: string) {
        for (let post of this.posts) {
            if (post.id === id) {
                return post;
            }
        }
        return false;
    };

    deletePostId(id: string) {
        for (let a = 0; a < this.posts.length; a++) {
            if (this.posts[a].id === id) {
                this.posts.splice(a, 1);
                return true;
            }
        }
        return false;
    };

    updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        for (let post of this.posts) {
            if (post.id === id) {
                post.title = title;
                post.shortDescription = shortDescription;
                post.content = content;
                post.blogId = blogId;
                return true;
            }
        }
        return false;
    };

    async createPost(newPost: PostsType): Promise<PostsType> {
        this.posts.push(newPost);
        return newPost;
    };
}