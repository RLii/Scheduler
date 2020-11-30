import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { SchedulesComponent } from './schedules/schedules.component';


const routes: Routes = [
  {path: 'schedules', component: SchedulesComponent},
  {path: 'courses', component: CoursesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
