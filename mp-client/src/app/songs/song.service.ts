import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subject, BehaviorSubject } from 'rxjs';
import { 
    Song, 
    fullSongDetailsResponse, 
    AllUserSongsResponse, 
    AddSong, 
    UpdateSong, 
    RemoveSong,
} from "./song-response.model";
import {
    AddSections,
    UpdateSection,
    RemoveSection,
    AddBpm,
} from "../shared/shared-response.model";
import {
    allUserSongs,
    fullSongDetails,
    addSong,
    updateSong,
    removeSong,
    addSection,
} from "./song.queries";
import {
    updateSection,
    removeSection,
    addBpm
} from "../shared/shared.queries";

@Injectable({ providedIn: 'root' })
export class SongService {
    songsChanged = new Subject<Song[]>();
    selectedSong = new BehaviorSubject<Song>(null);
    private songs: Song[] = [];
    private didLoadList = false;

    constructor(private apollo: Apollo) {}

    getServiceArray() {
        return this.songs.slice();
    }

    setServiceArray(arr) {
        if (!this.songs.length) {
            this.songs = arr.slice();
            this.songsChanged.next(this.songs.slice());
        } else {
            let currentSongs = this.songs.map((d) => d.id);
            let filterSongs = arr.filter(function (d) {
                return this.indexOf(d.id) < 0;
            }, currentSongs);
            let concatArray = filterSongs.concat(this.songs);
            let sortedSongs = concatArray.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
            this.songs = sortedSongs.slice();
            this.songsChanged.next(this.songs.slice());
        }
    }

    performCleanUp() {
        this.songs = [];
        this.songsChanged.next([]);
        this.selectedSong.next(null);
        this.didLoadList = false;
    }

    retrieveItem(id: String) {
        for (let i = 0; i < this.songs.length; i++) {
            if (this.songs[i].id === id) {
                return this.songs[i];
            }
        }
        return null;
    }

    findItemThenSection(id: String) {
        for (let i = 0; i < this.songs.length; i++) {
            for (let j = 0; j < this.songs[i].songSections.length; j++) {
                if (this.songs[i].songSections[j].id === id) {
                    return {
                        itemIndex: i,
                        sectionIndex: j
                    };
                }
            }
        }
        return false;
    }

    findSection(selectedItem, id: String) {
        for (let i = 0; i < selectedItem.value.songSections.length; i++) {
            if (selectedItem.value.songSections[i].id === id) {
                return i;
            }
        }
        return false;
    }

    addSectionToSongs(data, songId) {
        let addSections = [...data.sections];
        addSections.forEach(d => d["sectionBpms"] = []);
        const foundIndex = this.songs.findIndex((d) => d.id === songId);
        if (foundIndex > -1) {
            this.songs[foundIndex].songSections = this.songs[foundIndex].songSections.concat(addSections);
            this.selectedSong.next({...this.songs[foundIndex]});
            this.songsChanged.next(this.songs.slice());
        } else {
            return false;
        }
    }

    updateSectionInSongs(selectedSong, sectionId, formValues) {
        var songIndex = this.songs.findIndex(d => d.id === selectedSong.id);
        if (songIndex === -1) {
            return;
        }
        var songSectionIndex = this.songs[songIndex].songSections.findIndex(d => d.id === sectionId);
        if (songSectionIndex === -1) {
            return;
        }
        if (formValues.sectionName) {
            this.songs[songIndex].songSections[songSectionIndex].sectionName = formValues.sectionName;
        }
        if (formValues.targetBPM) {
            this.songs[songIndex].songSections[songSectionIndex].targetBPM = formValues.targetBPM;
        }
        this.selectedSong.next({...this.songs[songIndex]});
        this.songsChanged.next(this.songs.slice());
    }

    removeSectionFromSongs(id) {
        let findSection = this.findItemThenSection(id);
        if (findSection) {
            let removeSectionId = this.songs[findSection.itemIndex].songSections[findSection.sectionIndex].id;
            let newSections = this.songs[findSection.itemIndex].songSections.filter(d => d.id !== removeSectionId);
            this.songs[findSection.itemIndex].songSections = [...newSections];
            this.selectedSong.next({...this.songs[findSection.itemIndex]});
            this.songsChanged.next(this.songs.slice());
        } else {
            return false;
        }
    }

    pushServiceArr(song) {
        this.songs.push({...song});
    }

    findAndReplace(song) {
        if (!this.songs.length) return;
        const foundIndex = this.songs.findIndex((d) => d.id === song.id);
        if (foundIndex > -1) {
            this.songs[foundIndex] = {...song};
            this.songsChanged.next(this.songs.slice());
        } else {
            return false;
        }
    }

    findSong(songId) {
        if (!this.songs.length) return;
        const foundSong = this.songs.find((d) => d.id === songId);
        if (foundSong) { 
            return foundSong;
        } else {
            return false;
        }
    }

    returnDidLoadList() {
        return this.didLoadList;
    }

    setDidLoadListTrue() {
        this.didLoadList = true;
    }
    
    getAllSongs() {
        return this.apollo.watchQuery<AllUserSongsResponse>({
            query: allUserSongs,
        });
    }

    querySong(id: String) {
        return this.apollo.query<fullSongDetailsResponse>({
            query: fullSongDetails,
            variables: {
                id,
            },
        });
    }

    selectSong(id: String) {
        var foundSong = this.findSong(id);
        if (foundSong !== false) {
            return this.selectedSong.next({...foundSong});
        } else {
            return this.selectedSong.next(null);
        }
    }

    getSection(id: String) {
        if (!this.selectedSong.value) {
            let foundSection = this.findItemThenSection(id);
            if (foundSection === false) {
                return false;
            } else {
                this.selectedSong.next({...this.songs[foundSection.itemIndex]});
                return this.selectedSong.value.songSections[foundSection.sectionIndex];
            }
        } else {
            let foundSectionId = this.findSection(this.selectedSong, id);
            if (foundSectionId === false) {
                return false;
            } else {
                return this.selectedSong.value.songSections[foundSectionId];
            }
        }
    }

    addNewSong(artistName, songName) {
        return this.apollo.mutate<AddSong>({
            mutation: addSong,
            variables: {
                artistName: artistName,
                songName: songName,
            },
        });
    }

    addNewSongToArray(newSong) {
        this.songs.push(newSong);
        this.songsChanged.next(this.songs.slice());
    }

    updateSong(formValues, id) {
        var mutationVariables = {
            id
        };
        if (formValues.artistName) {
            mutationVariables["artistName"] = formValues.artistName;
        }
        if (formValues.songName) {
            mutationVariables["songName"] = formValues.songName;
        }
        return this.apollo.mutate<UpdateSong>({
            mutation: updateSong,
            variables: { ...mutationVariables },
        });
    }

    updateSongWithinArray(updatedSong) {
        let updatedSongs = this.songs.map(d => {
            if (d.id === updatedSong.id) {
                let updated = {...updatedSong};
                if (d.songSections) {
                    updated.songSections = [...d.songSections];
                }
                this.selectedSong.next({...updated});
                return updated;
            } else {
                return {...d};
            }
        });
        this.songs = [...updatedSongs];
        this.songsChanged.next(this.songs.slice());
    }

    deleteSong(id) {
        return this.apollo.mutate<RemoveSong>({
            mutation: removeSong,
            variables: {
                id
            },
        });
    }

    deleteSongFromArray(id) {
        let filteredSongs = this.songs.filter((d) => d.id !== id);
        this.songs = filteredSongs.slice();
        this.selectedSong.next(null);
        this.songsChanged.next(this.songs.slice());
    }

    addSections(sectionsArray, songId) {
        return this.apollo.mutate<AddSections>({
            mutation: addSection,
            variables: {
                Sects: sectionsArray,
                songId,
            },
        });
    }

    updateSection(formValues, sectionId) {
        var mutationVariables = {
            sectionId
        };
        if (formValues.sectionName) {
            mutationVariables["sectionName"] = formValues.sectionName;
        }
        if (formValues.targetBPM) {
            mutationVariables["targetBPM"] = formValues.targetBPM;
        }
        return this.apollo.mutate<UpdateSection>({
            mutation: updateSection,
            variables: { 
                ...mutationVariables,
                isSong: true, 
            },
        });
    }

    removeSection(sectionId) {
        return this.apollo.mutate<RemoveSection>({
            mutation: removeSection,
            variables: { 
                id: sectionId,
                isSong: true, 
            },
        });
    }

    addBpm(sectionId, bpm) {
        return this.apollo.mutate<AddBpm>({
            mutation: addBpm,
            variables: { 
                sectionId, 
                bpm,
                isSong: true, 
            },
        });
    }

    addBpmToArray(data, songId, sectionId) {
        var songIndex = this.songs.findIndex(d => d.id === songId);
        if (songIndex === -1) {
            return;
        }
        var songSectionIndex = this.songs[songIndex].songSections.findIndex(d => d.id === sectionId);
        if (songSectionIndex === -1) {
            return;
        }
        this.songs[songIndex].songSections[songSectionIndex].sectionBpms.push(data);
        this.songsChanged.next(this.songs.slice());
    }

}