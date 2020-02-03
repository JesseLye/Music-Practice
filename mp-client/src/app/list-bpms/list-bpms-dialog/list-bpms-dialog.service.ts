import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

export interface BpmChart {
    position: number
    bpm: number;
    createdAt: String;
}

export interface BpmDetails {
    bpmArray: BpmChart[];
    serviceType: String;
    sectionId: String;
}

@Injectable({ providedIn: 'root' })
export class ListBpmsDialogService {
    bpmDetails = new BehaviorSubject<BpmDetails>(null);
    didUpdate = new Subject<Boolean>();
    
    constructor() { }

    setBpmDetails(bpmDetails) {
        this.bpmDetails.next({ ...bpmDetails });
    }

    clearBpmDetails() {
        this.bpmDetails.next(null);
    }
}