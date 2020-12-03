import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { CoursesComponent } from './courses/courses.component';
import { HttpClientModule } from '@angular/common/http';
import { SchedulesComponent } from './schedules/schedules.component';
import { SavedCoursesComponent } from './saved-courses/saved-courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { DemoCoursesComponent } from './demo-courses/demo-courses.component';
import { DemoSchedulesComponent } from './demo-schedules/demo-schedules.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule} from '@angular/material/expansion';
import { AdminComponent } from './admin/admin.component';
@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    SchedulesComponent,
    SavedCoursesComponent,
    DashboardComponent,
    MainComponent,
    RegisterComponent,
    DemoSchedulesComponent,
    DemoCoursesComponent,
    AdminComponent
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
