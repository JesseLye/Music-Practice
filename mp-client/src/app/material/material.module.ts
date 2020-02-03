import { NgModule } from '@angular/core';
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatSidenavModule,
  MatGridListModule,
  MatListModule,
  MatRippleModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSliderModule,
  MatSnackBarModule,
  MatIconModule,
  MatToolbarModule,
  MatCheckboxModule,
} from '@angular/material';

const Material = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatSidenavModule,
  MatGridListModule,
  MatListModule,
  MatRippleModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSliderModule,
  MatSnackBarModule,
  MatIconModule,
  MatToolbarModule,
  MatCheckboxModule,
];

@NgModule({
  imports: [Material],
  exports: [Material]
})
export class MaterialModule {}
