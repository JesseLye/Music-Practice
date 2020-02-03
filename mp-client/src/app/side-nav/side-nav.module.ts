import { NgModule } from '@angular/core';
import { SidenavComponent } from "./side-nav.component";
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    SidenavComponent,
  ],
  imports: [
    RouterModule,
    MaterialModule,
  ],
  exports: [
    SidenavComponent,
  ],
})
export class SidenavModule {}
