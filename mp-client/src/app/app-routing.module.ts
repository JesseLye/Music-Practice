import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from "./landing-page/landing-page.component";
// PreloadAllModules: Do That Later

const appRoutes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'signup', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'songs', loadChildren: './songs/songs.module#SongsModule' },
  { path: 'exercises', loadChildren: './exercises/exercises.module#ExercisesModule' },
  { path: 'practice-stats', loadChildren: './practice-statistics/practice-statistics.module#PracticeStatisticsModule' },
  { path: 'list-bpms', loadChildren: './list-bpms/list-bpms.module#ListBpmsModule' },
  { path: 'metronome', loadChildren: './metronome/metronome.module#MetronomeModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
  { path: 'reset-password', loadChildren: './reset-password/reset-password.module#ResetPasswordModule' },
  { path: '**', redirectTo: '/signin' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
