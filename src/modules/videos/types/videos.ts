export enum VideoResolutions {
  P144 = '144p',
  P240 = '240p',
  P360 = '360p',
  P480 = '480p',
  P720 = '720p',
  P1080 = '1080p',
  P1440 = '1440p',
  P2160 = '2160p',
}

export type Video = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: null;
  createdAt: Date;
  publicationDate: Date;
  availableResolutions: VideoResolutions[];
};

export type CreateDtoType = Pick<Video, 'author' | 'title' | 'availableResolutions'>;
