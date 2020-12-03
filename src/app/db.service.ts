import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private http: HttpClient, private ls: LocalStorageService) { }

  updateUsers(email: string, reason: string){
    var temp = "bearer "+this.ls.getToken();
    return this.http.put('/api/updateuser',{
      account_email: email,
      reason: reason

    },{headers: new HttpHeaders({"authorization" : temp}), responseType:'text'})
    
  }

  getUsers(){
    var temp = "bearer "+this.ls.getToken();
    return this.http.get('/api/allusers',{headers: new HttpHeaders({"authorization" : temp})})
  }

  getReviews(subject:string, code: string, component:string){
    return this.http.get('/api/courses/review'+subject+'/'+code+'/'+component)
  }

  writeReview(subject: string, course_code: string, component: string, review:string){
    var temp = "bearer "+this.ls.getToken();
    return this.http.put('/api/courses/review', {
      subject: subject,
      course_code: course_code,
      component: component,
      review:review
    }, 
    {headers: new HttpHeaders({"authorization" : temp} ),responseType:'text'})
  }

  saveEdits(oldName:string, json:any){
    var temp = "bearer "+this.ls.getToken();
    return this.http.put('/api/schedules/edit', {
      
            schedule_name: oldName,
            new_name: json.schedule_name,
            public: json.public,
            description: json.description,
            subjects: json.subjects,
            course_codes: json.course_codes,
            components: json.components
    },
    {headers: new HttpHeaders({"authorization" : temp}),responseType:"text"})
  }

  verifyUser(){
    var temp = "bearer "+this.ls.getToken();
    return this.http.get('/api/verify', {headers: new HttpHeaders({"authorization" : temp})})
  }

  userLogin(email: string, password: string){
    return this.http.get('/api/users/'+email+'/' + password, {responseType: 'text'})
  }

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
  saveSchedule(name: string, isPublic: boolean, description: string){
    var temp = "bearer "+this.ls.getToken();
    return this.http.post('/api/schedules', {
      schedule_name: name,
      public: isPublic,
      description: description,
      email: this.ls.getLog()
    },{headers: new HttpHeaders({"authorization" : temp}),responseType:"text"})
  }
  deleteASchedule(name: string){
    var temp = "bearer "+this.ls.getToken();
    return this.http.request('delete','/api/schedule',{
headers: new HttpHeaders({'Content-Type': 'application/json','authorization': temp}),
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
