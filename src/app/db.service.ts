import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient) { }

  registerUser(name: string, email: string, password: string){
    return this.http.post('/api/users' , {
      name: name,
      email: email,
      password: password
    },{responseType: 'text'})
  }

  getCourses(){
    return this.http.get('/api/courses')
  }
  getSchedules(){
    return this.http.get('/api/schedules')
  }
  saveSchedule(name: string){

    return this.http.post('/api/schedules', {
      schedule_name: name
    },{responseType: 'text'})
  }
  deleteAllSchedules(){
    return this.http.delete('/api/schedules',  {responseType:'text'})
  }
  deleteASchedule(name: string){
    const options= {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body:{
        schedule_name: name
      },
      responseType:'text'
    }
    return this.http.request('delete','/api/schedule',{
headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body:{
        schedule_name: name
      },
      responseType:'text'
    })
  }
  getCourseInfoBySubject(subject :string){
    return this.http.get('/api/courses/course-codes/' + subject)
  }
  putCoursesIntoSchedule(schedule: string, subjects: any[], course_codes: any[], components: any[]){
    return this.http.put('/api/schedules/schedule-contents',{
      schedule_name:schedule,
      subjects:subjects,
      course_codes:course_codes,
      components:components
    },{responseType:"text"})
  }
  getScheduleContentsByName(name: string){
    return this.http.get('/api/schedules/' + name)
  }
  getCourseTimeTable(subject:string, courseCode: string, courseComp: string)
  {
    return this.http.get('/api/courses/'+subject+'/'+courseCode+'/'+courseComp)
  }
}
