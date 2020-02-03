import { Status, Section } from "../shared/shared-response.model";

export interface AllUserExercisesResponse {
    allUserExercises: {
        exercises: Exercise[];
        status: Status;
    }
};

export interface Exercise {
    id: string;
    exerciseName: string;
    exerciseSections?: Section[];
    status: Status;
};

export interface fullExerciseDetailsResponse {
    fullExerciseDetails: {
        id: string;
        exerciseName: string;
        execiseSections?: {
            sections: Section[];
        };
        status: Status;
    }
};

export interface AddExercise {
    addExercise: Exercise;
};

export interface UpdateExercise {
    updateExercise: Status;
};

export interface RemoveExercise {
    removeExercise: Status;
};

