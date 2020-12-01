import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { SchedulesComponent } from './schedules/schedules.component';


const routes: Routes = [
  {path: 'schedules', component: SchedulesComponent},
  {path: 'courses', component: CoursesComponent},
  {path: 'main', component: MainComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', redirectTo:'main',pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
