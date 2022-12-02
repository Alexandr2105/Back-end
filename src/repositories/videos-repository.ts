export type availableResolutionsType = ['P144' | 'P240' | 'P360' | 'P480' | 'P720' | 'P1080' | 'P1440' | 'P2160'];

export class VideoType {
    constructor(public id: number,
                public title: string,
                public author: string,
                public canBeDownloaded: boolean,
                public minAgeRestriction: null | number,
                public createdAt: Date,
                public publicationDate: Date,
                public availableResolutions: availableResolutionsType) {
    }
}

export class VideosRepository {
    videos = [
        new VideoType(0, "video-00", "Alex", false, null, new Date(), new Date(), ["P144"]),
        new VideoType(1, "video-01", "Alex", true, null, new Date(), new Date(), ["P720"])
    ];

    getAllVideo() {
        return this.videos;
    };

    findVideosId(id: number) {
        let video = this.videos.find(v => v.id === id);
        if (video) {
            return video;
        }
    };

    videoDelete(id: number) {
        for (let i = 0; i < this.videos.length; i++) {
            let video = this.videos[i]
            if (video.id === id) {
                this.videos.splice(i, 1)
                return true;
            }
        }
        return false;
    };

    createVideo(newVideo: VideoType) {
        this.videos.push(newVideo);
        return newVideo;
    };

    updateVideo(id: number, title: string, author: string, availableResolutions: availableResolutionsType,
                canBeDownloaded: boolean, minAgeRestriction: number, publicationDate: Date) {
        let video = this.videos.find(v => v.id === id);
        if (video) {
            video.title = title;
            video.author = author;
            video.availableResolutions = availableResolutions;
            video.canBeDownloaded = canBeDownloaded;
            video.minAgeRestriction = minAgeRestriction;
            video.publicationDate = publicationDate;
            return 204;
        } else {
            return 404;
        }
    };
}

export const videosRepository = new VideosRepository();