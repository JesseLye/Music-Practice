import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListBpmsComponent } from "./list-bpms.component";
import { ListBpmsRoutingModule } from "./list-bpms-routing.module";
import { ListBpmsDialog, DialogEntryComponent } from "./list-bpms-dialog/list-bpms-dialog.component";

@NgModule({
  declarations: [
    ListBpmsComponent,
    DialogEntryComponent,
    ListBpmsDialog,
  ],
  entryComponents: [
    DialogEntryComponent,
    ListBpmsDialog,
  ],
  imports: [
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ListBpmsRoutingModule,
  ],
})
export class ListBpmsModule {}
