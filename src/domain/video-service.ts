import addDays from 'date-fns/addDays';
import {availableResolutionsType, videosRepository, VideoType} from "../repositories/video-repository";

class VideoService {
    getAllVideo() {
        return videosRepository.getAllVideo();
    };

    findVideosId(id: number) {
        return videosRepository.findVideosId(id);
    };

    videoDelete(id: number) {
        return videosRepository.videoDelete(id);
    };

    createVideo(title: string, author: string, availableResolutions: availableResolutionsType) {
        const dateNow = new Date();
        const newVideo = new VideoType(+dateNow, title, author, false, null, dateNow, addDays(dateNow, 1), availableResolutions);
        return videosRepository.createVideo(newVideo);
    };

    updateVideo(id: number, title: string, author: string, availableResolutions: availableResolutionsType,
                canBeDownloaded: boolean, minAgeRestriction: number, publicationDate: Date) {
        return videosRepository.updateVideo(id, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate);
    };
}

export const videosService = new VideoService();