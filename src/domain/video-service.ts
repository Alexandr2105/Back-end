import addDays from 'date-fns/addDays';
import {availableResolutionsType, videosRepository} from "../repositories/video-repository";

export const videosService = {
    getAllVideo() {
        return videosRepository.getAllVideo();
    },
    findVideosId(id: number) {
        return videosRepository.findVideosId(id);
    },
    videoDelete(id: number) {
        return videosRepository.videoDelete(id);
    },
    createVideo(title: string, author: string, availableResolutions: availableResolutionsType) {
        const dateNow = new Date();
        const newVideo = {
            id: +dateNow,
            title: title,
            author: author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: dateNow,
            publicationDate: addDays(dateNow, 1),
            availableResolutions: availableResolutions,
        };
        return videosRepository.createVideo(newVideo);
    },
    updateVideo(id: number, title: string, author: string, availableResolutions: availableResolutionsType,
                canBeDownloaded: boolean, minAgeRestriction: number, publicationDate: Date) {
        return videosRepository.updateVideo(id, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate);
    },
};