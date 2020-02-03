import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SidenavModule } from '../side-nav/side-nav.module';
import { MatProgressButtonsModule } from 'mat-progress-buttons';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SidenavModule,
    MatProgressButtonsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    SidenavModule,
    MatProgressButtonsModule,
  ],
})
export class SharedModule {}
