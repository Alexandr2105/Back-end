import addDays from 'date-fns/addDays';

type availableResolutionsType = ['P144' | 'P240' | 'P360' | 'P480' | 'P720' | 'P1080' | 'P1440' | 'P2160'];

type VideoType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: null | number;
    createdAt: Date;
    publicationDate: Date;
    availableResolutions: availableResolutionsType;
};

export const videos: VideoType[] = [
    {
        id: 0,
        title: "video-00",
        author: "Alex",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(),
        publicationDate: new Date(),
        availableResolutions: [
            "P144"
        ]
    }, {
        id: 1,
        title: "video-01",
        author: "Alex",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date(),
        publicationDate: new Date(),
        availableResolutions: [
            "P720"
        ]
    },
];

export const videosRepository = {
    getAllVideo() {
        return videos;
    },
    findVideosId(id: number) {
        let video = videos.find(v => v.id === id);
        if (video) {
            return video;
        }
    },
    videoDelete(id: number) {
        for (let video of videos) {
            if(video.id===id){
                videos.splice(+video,1)
                return true;
            }
        }
        return false;
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
        videos.push(newVideo);
        return newVideo;
    },
    updateVideo(id: number, title: string, author: string, availableResolutions: availableResolutionsType,
                canBeDownloaded: boolean, minAgeRestriction: number, publicationDate: Date) {
        let video = videos.find(v => v.id === id);
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

    },
};