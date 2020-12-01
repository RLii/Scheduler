import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { AuthGuard } from './auth.service';


const routes: Routes = [
  {path: 'schedules', component: SchedulesComponent, canActivate: [AuthGuard]},
  {path: 'courses', component: CoursesComponent, canActivate: [AuthGuard]},
  {path: 'main', component: MainComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', redirectTo:'main',pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
