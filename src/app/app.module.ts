import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoursesComponent } from './courses/courses.component';
import { HttpClientModule } from '@angular/common/http';
import { SchedulesComponent } from './schedules/schedules.component';
import { SavedCoursesComponent } from './saved-courses/saved-courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    SchedulesComponent,
    SavedCoursesComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
