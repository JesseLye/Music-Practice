import gql from 'graphql-tag';

export const allUserExercises = gql`
{
    allUserExercises {
      exercises {
        id
        exerciseName
        createdAt
        exerciseSections {
            id
            sectionName
            targetBPM
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


export const fullExerciseDetails = gql`
  query exercise($id: ID!) {
    fullExerciseDetails(id: $id) {
        id
        exerciseName
        createdAt
        exerciseSections {
          id
          sectionName
          targetBPM
          ExerciseId
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

export const addExercise = gql`
    mutation addExercise($exerciseName: String!) {
        addExercise(exerciseName: $exerciseName) {
            id
            exerciseName
            status {
                ok
                errMessage
            }
        }
    }
`;

export const updateExercise = gql`
    mutation updateExercise($id: ID!, $exerciseName: String!) {
        updateExercise(id: $id, exerciseName: $exerciseName) {
            ok
            errMessage
        }
    }
`;

export const removeExercise = gql`
    mutation removeExercise($id: ID!) {
        removeExercise(id: $id) {
            ok
            errMessage
        }
    }
`;

export const addSection = gql`
    mutation addSections($Sects: [CreateSectionType!]!, $exerciseId: ID!) {
        addSections(input: $Sects, ExerciseId: $exerciseId) {
            sections {
                id
                sectionName
                targetBPM
                ExerciseId
            }
            status {
                ok
                errMessage
            }
        }
    }
`;


