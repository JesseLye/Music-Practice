import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subject, BehaviorSubject } from 'rxjs';
import { 
    Exercise,
    fullExerciseDetailsResponse,
    AllUserExercisesResponse,
    AddExercise,
    UpdateExercise,
    RemoveExercise,
} from "./exercise-response.model";
import {
    AddSections,
    UpdateSection,
    RemoveSection,
    AddBpm,
} from "../shared/shared-response.model";
import {
    allUserExercises,
    fullExerciseDetails,
    addExercise,
    updateExercise,
    removeExercise,
    addSection,
} from "./exercise.queries";
import {
    updateSection,
    removeSection,
    addBpm
} from "../shared/shared.queries";

@Injectable({ providedIn: 'root' })
export class ExerciseService {
    exercisesChanged = new Subject<Exercise[]>();
    selectedExercise = new BehaviorSubject<Exercise>(null);
    private exercises: Exercise[] = [];
    private didLoadList = false;

    constructor(private apollo: Apollo) {}

    getServiceArray() {
        return this.exercises.slice();
    }

    setServiceArray(arr) {
        if (!this.exercises.length) {
            this.exercises = arr.slice();
            this.exercisesChanged.next(this.exercises.slice());
        } else {
            let currentExercises = this.exercises.map((d) => d.id);
            let filterExercises = arr.filter(function (d) {
                return this.indexOf(d.id) < 0;
            }, currentExercises);
            let concatArray = filterExercises.concat(this.exercises);
            let sortedExercises = concatArray.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
            this.exercises = sortedExercises.slice();
            this.exercisesChanged.next(this.exercises.slice());
        }
    }

    performCleanUp() {
        this.exercises = [];
        this.exercisesChanged.next([]);
        this.selectedExercise.next(null);
        this.didLoadList = false;
    }

    pushServiceArr(exercise) {
        this.exercises.push({...exercise});
    }

    retrieveItem(id: String) {
        for (let i = 0; i < this.exercises.length; i++) {
            if (this.exercises[i].id === id) {
                return this.exercises[i];
            }
        }
        return null;
    }
    
    findItemThenSection(id: String) {
        for (let i = 0; i < this.exercises.length; i++) {
            for (let j = 0; j < this.exercises[i].exerciseSections.length; j++) {
                if (this.exercises[i].exerciseSections[j].id === id) {
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
        for (let i = 0; i < selectedItem.value.exerciseSections.length; i++) {
            if (selectedItem.value.exerciseSections[i].id === id) {
                return i;
            }
        }
        return false;
    }

    addSectionToExercises(data, exerciseId) {
        let addSections = [...data.sections];
        addSections.forEach(d => d["sectionBpms"] = []);
        const foundIndex = this.exercises.findIndex((d) => d.id === exerciseId);
        if (foundIndex > -1) {
            this.exercises[foundIndex].exerciseSections = this.exercises[foundIndex].exerciseSections.concat(addSections);
            this.selectedExercise.next({...this.exercises[foundIndex]});
            this.exercisesChanged.next(this.exercises.slice());
        } else {
            return false;
        }
    }

    updateSectionInExercises(selecetedExercise, sectionId, formValues) {
        var exerciseIndex = this.exercises.findIndex(d => d.id === selecetedExercise.id);
        if (exerciseIndex === -1) {
            return;
        }
        var exerciseSectionIndex = this.exercises[exerciseIndex].exerciseSections.findIndex(d => d.id === sectionId);
        if (exerciseSectionIndex === -1) {
            return;
        }
        if (formValues.sectionName) {
            this.exercises[exerciseIndex].exerciseSections[exerciseSectionIndex].sectionName = formValues.sectionName;
        }
        if (formValues.targetBPM) {
            this.exercises[exerciseIndex].exerciseSections[exerciseSectionIndex].targetBPM = formValues.targetBPM;
        }
        this.selectedExercise.next({...this.exercises[exerciseIndex]});
        this.exercisesChanged.next(this.exercises.slice());
    }


    removeSectionFromExercises(id) {
        let findSection = this.findItemThenSection(id);
        if (findSection) {
            let removeSectionId = this.exercises[findSection.itemIndex].exerciseSections[findSection.sectionIndex].id;
            let newSections = this.exercises[findSection.itemIndex].exerciseSections.filter(d => d.id !== removeSectionId);
            this.exercises[findSection.itemIndex].exerciseSections = [...newSections];
            this.selectedExercise.next({...this.exercises[findSection.itemIndex]});
            this.exercisesChanged.next(this.exercises.slice());
        } else {
            return false;
        }
    }

    findAndReplace(exercise) {
        if (!this.exercises.length) return;
        const foundIndex = this.exercises.findIndex((d) => d.id === exercise.id);
        if (foundIndex > -1) {
            this.exercises[foundIndex] = {...exercise};
            this.exercisesChanged.next(this.exercises.slice());
        } else {
            return false;
        }
    }

    findExercise(exerciseId) {
        if (!this.exercises.length) return;
        const foundExercise = this.exercises.find((d) => d.id === exerciseId);
        if (foundExercise) { 
            return foundExercise;
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
    
    getAllExercises() {
        return this.apollo.watchQuery<AllUserExercisesResponse>({
            query: allUserExercises,
        });
    }

    queryExercise(id: String) {
        return this.apollo.query<fullExerciseDetailsResponse>({
            query: fullExerciseDetails,
            variables: {
                id,
            },
        });
    }

    selectExercise(id: String) {
        var foundExercise = this.findExercise(id);
        if (foundExercise !== false) {
            return this.selectedExercise.next({...foundExercise});
        } else {
            return this.selectedExercise.next(null);
        }
    }

    getSection(id: String) {
        if (!this.selectedExercise.value) {
            let foundSection = this.findItemThenSection(id);
            if (foundSection === false) {
                return false;
            } else {
                this.selectedExercise.next({...this.exercises[foundSection.itemIndex]});
                return this.selectedExercise.value.exerciseSections[foundSection.sectionIndex];
            }
        } else {
            let foundSectionId = this.findSection(this.selectedExercise, id);
            if (foundSectionId === false) {
                return false;
            } else {
                return this.selectedExercise.value.exerciseSections[foundSectionId];
            }
        }
    }

    addNewExercise(exerciseName) {
        return this.apollo.mutate<AddExercise>({
            mutation: addExercise,
            variables: {
                exerciseName,
            }
        });
    }

    addNewExerciseToArray(newExercise) {
        this.exercises.push(newExercise);
        this.exercisesChanged.next(this.exercises.slice());
    }

    updateExercise(formValues, id) {
        var mutationVariables = {
            id
        };
        if (formValues.exerciseName) {
            mutationVariables["exerciseName"] = formValues.exerciseName;
        }
        return this.apollo.mutate<UpdateExercise>({
            mutation: updateExercise,
            variables: { ...mutationVariables },
        });
    }

    updateExerciseWithinArray(updatedExercise) {
        let updatedExercises = this.exercises.map(d => {
            if (d.id === updatedExercise.id) {
                let updated = {...updatedExercise};
                if (d.exerciseSections) {
                    updated.exerciseSections = [...d.exerciseSections];
                }
                this.selectedExercise.next({...updated});
                return updated;
            } else {
                return {...d};
            }
        });
        this.exercises = [...updatedExercises];
        this.exercisesChanged.next(this.exercises.slice());
    }

    removeExercise(id) {
        return this.apollo.mutate<RemoveExercise>({
            mutation: removeExercise,
            variables: {
                id
            }
        });
    }

    deleteExerciseFromArray(id) {
        let filteredExercises = this.exercises.filter((d) => d.id !== id);
        this.exercises = filteredExercises.slice();
        this.selectedExercise.next(null);
        this.exercisesChanged.next(this.exercises.slice());
    }

    addSections(sectionsArray, exerciseId) {
        return this.apollo.mutate<AddSections>({
            mutation: addSection,
            variables: {
                Sects: sectionsArray,
                exerciseId,
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
                isSong: false, 
            },
        });
    }

    removeSection(sectionId) {
        return this.apollo.mutate<RemoveSection>({
            mutation: removeSection,
            variables: { 
                id: sectionId,
                isSong: false, 
            },
        });
    }

    addBpm(sectionId, bpm) {
        return this.apollo.mutate<AddBpm>({
            mutation: addBpm,
            variables: { 
                sectionId, 
                bpm,
                isSong: false, 
            },
        });
    }

    addBpmToArray(data, exerciseId, sectionId) {
        var exerciseIndex = this.exercises.findIndex(d => d.id === exerciseId);
        if (exerciseIndex === -1) {
            return;
        }
        var songSectionIndex = this.exercises[exerciseIndex].exerciseSections.findIndex(d => d.id === sectionId);
        if (songSectionIndex === -1) {
            return;
        }
        this.exercises[exerciseIndex].exerciseSections[songSectionIndex].sectionBpms.push(data);
        this.exercisesChanged.next(this.exercises.slice());
    }

}