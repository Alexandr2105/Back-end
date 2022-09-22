import {videos} from "./video-repository";
import {blogs} from "./blogs-repository";
import {posts} from "./posts-repository";

export const testingRepository = {
    deleteAllVideo() {
        videos.length = 0;
        blogs.length = 0;
        posts.length = 0;
    },
}