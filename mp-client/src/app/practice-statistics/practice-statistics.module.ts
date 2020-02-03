import { NgModule } from '@angular/core';
import { PracticeStatisticsComponent } from "./practice-statistics.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PracticeStatisticsDialog, DialogEntryComponent } from "./practice-statistics-dialog/practice-statistics-dialog.component";
import { PracticeStatisticsRoutingModule } from "./practice-statistics-routing.module";

@NgModule({
    declarations: [
        PracticeStatisticsComponent,
        LineChartComponent,
        PieChartComponent,
        BarChartComponent,
        PracticeStatisticsDialog,
        DialogEntryComponent,
    ],
    entryComponents: [
        PracticeStatisticsDialog,
        DialogEntryComponent,
    ],
    imports: [
        RouterModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        PracticeStatisticsRoutingModule,
    ],
})
export class PracticeStatisticsModule { }


