import addDays from 'date-fns/addDays';
import {
    availableResolutionsType,
    VideosRepository,
    VideoType
} from "../repositories/videos-repository";
import {inject, injectable} from "inversify";

@injectable()
export class VideosService {

    constructor(@inject(VideosRepository) protected videosRepository: VideosRepository) {
    };

    getAllVideo() {
        return this.videosRepository.getAllVideo();
    };

    findVideosId(id: number) {
        return this.videosRepository.findVideosId(id);
    };

    videoDelete(id: number) {
        return this.videosRepository.videoDelete(id);
    };

    createVideo(title: string, author: string, availableResolutions: availableResolutionsType) {
        const dateNow = new Date();
        const newVideo = new VideoType(+dateNow, title, author, false, null, dateNow, addDays(dateNow, 1), availableResolutions);
        return this.videosRepository.createVideo(newVideo);
    };

    updateVideo(id: number, title: string, author: string, availableResolutions: availableResolutionsType,
                canBeDownloaded: boolean, minAgeRestriction: number, publicationDate: Date) {
        return this.videosRepository.updateVideo(id, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate);
    };
}