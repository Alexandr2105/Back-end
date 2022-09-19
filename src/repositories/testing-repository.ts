import {videos} from "./video-repository";
export const testingRepository={
    deleteAllVideo(){
        videos.length=0;
    },
}