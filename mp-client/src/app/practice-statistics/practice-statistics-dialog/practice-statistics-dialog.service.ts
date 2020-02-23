import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PracticeStatisticDialogService {
    dateRange = new BehaviorSubject<{startDate: string, endDate: string}>(null);
    constructor() {}

    setDates(startDate, endDate) {
        this.dateRange.next({startDate, endDate});
    }

    clearDates() {
        this.dateRange.next({
            startDate: null,
            endDate: null,
        });
    }
}