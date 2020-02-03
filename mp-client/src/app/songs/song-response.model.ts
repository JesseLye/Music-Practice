import { Status, Section } from "../shared/shared-response.model";

export interface AllUserSongsResponse {
    allUserSongs: {
        songs: Song[];
        status: Status;
    }
};

export interface Song {
    id: string;
    artistName: string;
    songName: string;
    songSections?: Section[];
    status: Status;
};

export interface fullSongDetailsResponse {
    fullSongDetails: {
        id: string;
        artistName: string;
        songName: string;
        songSections?: Section[];
        status: Status;
    }
};

export interface AddSong {
    addSong: Song;
};

export interface UpdateSong {
    updateSong: Status;
};

export interface RemoveSong {
    removeSong: Status;
};
