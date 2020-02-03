import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MetronomeRoutingModule } from "./metronome-routing.module";
import { MetronomeComponent, MetronomeEntryDialogComponent } from './metronome.component';

@NgModule({
  declarations: [
    MetronomeComponent,
    MetronomeEntryDialogComponent,
  ],
  entryComponents: [
    MetronomeEntryDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MetronomeRoutingModule,
  ]
})
export class MetronomeModule { }
