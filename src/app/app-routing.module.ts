import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { AuthGuard, AdminGuard } from './auth.service';
import { AdminComponent } from './admin/admin.component';
import { CopyrightComponent} from './copyright/copyright.component'
import { PassResetComponent } from './pass-reset/pass-reset.component';

const routes: Routes = [
  {path: 'schedules', component: SchedulesComponent, canActivate: [AuthGuard]},
  {path: 'courses', component: CoursesComponent, canActivate: [AuthGuard]},
  {path: 'main', component: MainComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', redirectTo:'main',pathMatch: 'full'},
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  {path: 'copyright', component: CopyrightComponent},
  {path: 'passreset', component: PassResetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
