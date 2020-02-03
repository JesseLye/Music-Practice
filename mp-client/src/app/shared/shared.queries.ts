import gql from 'graphql-tag';

export const updateSection = gql`
    mutation updateSection($sectionId: ID!, $sectionName: String, $targetBPM: Int, $isSong: Boolean!) {
        updateSection(id: $sectionId, sectionName: $sectionName, targetBPM: $targetBPM, isSong: $isSong) {
            ok
            errMessage
        }
    }
`

export const removeSection = gql`
    mutation removeSection($id: ID!, $isSong: Boolean!) {
        removeSection(id: $id, isSong: $isSong) {
            ok
            errMessage
        }
    }
`

export const addBpm = gql`
    mutation addBpm($sectionId: ID!, $bpm: Int!, $isSong: Boolean!) {
        addBpm(id: $sectionId, bpm: $bpm, isSong: $isSong) {
            id
            bpm
            createdAt
            status {
                ok
                errMessage
            }
        }
    }
`

export const removeBpm = gql`
        mutation removeBpm($bpms: [RemoveBpmType!]!, $sectionId: ID!, $isSong: Boolean!) {
            removeBpm(bpms: $bpms, sectionId: $sectionId, isSong: $isSong) {
                ok
                errMessage
            }
        }
    `