import gql from 'graphql-tag';

export const allUserSongs = gql`
{
    allUserSongs {
      songs {
        id
        songName
        artistName
        createdAt
        songSections {
            id
            sectionName
            targetBPM
            SongId
            createdAt
        }
      }
      status {
        ok
        errMessage
      }
    }
  }
`;

export const fullSongDetails = gql`
  query fullSongDetails($id: ID!) {
    fullSongDetails(id: $id) {
        id
        songName
        artistName
        createdAt
        songSections {
            id
            sectionName
            targetBPM
            SongId
            createdAt
            sectionBpms {
                id
                bpm
                createdAt
            }
        }
        status {
            ok
            errMessage
        }
    }   
  }
`;

export const addSong = gql`
    mutation addSong($artistName: String!, $songName: String!) {
        addSong(artistName: $artistName, songName: $songName) {
            id
            artistName
            songName
            status {
                ok
                errMessage
            }
        }
    }
`;

export const updateSong = gql`
    mutation updateSong($id: ID!, $artistName: String!, $songName: String!) {
        updateSong(id: $id, artistName: $artistName, songName: $songName) {
            ok
            errMessage
        }
    }
`;

export const removeSong = gql`
    mutation removeSong($id: ID!) {
        removeSong(id: $id) {
            ok
            errMessage
        }
    }
`;

export const addSection = gql`
    mutation addSections($Sects: [CreateSectionType!]!, $songId: ID!) {
        addSections(input: $Sects, SongId: $songId) {
            sections {
                id
                sectionName
                targetBPM
                SongId
            }
            status {
                ok
                errMessage
            }
        }
    }
`;
