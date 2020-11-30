import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service'
import {SavedCoursesService} from '../saved-courses.service'

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit {

  newScheduleName: string;
  deleteScheduleName: string;
  
  timetableSchName: string;
  timetable:any[];
  ttSearchSubject:string = "";
  ttSearchCode:string = "";
  ttSearchComp:string = "";

  results: any;
  message: any;

  savedCourses: any;
  temp :any;
  courseCodes: any[] = [];
  subjects: any[] = [];
  components: any[] = [];
  startTimes: any[] = [];
  endTimes: any[] = [];
  days: any[] =[];

  constructor(private db: DbService,
              private scService: SavedCoursesService) { }

  ngOnInit(): void {
    this.displaySchedules();
  }

  displaySchedules(){
    this.db.getSchedules().subscribe(data => {
      this.results = data
      this.results = this.results.result
  })
  this.timetable = undefined;
}

  createNewSchedule(){
    this.db.saveSchedule(this.newScheduleName).subscribe(data=>{
      alert(data)
      this.displaySchedules();
    },error =>{
      alert(error.error)
    });
  }

  deleteSchedules(){
  this.db.deleteAllSchedules().subscribe(data =>{
    alert(data)
    this.displaySchedules();
  }, error => {
    alert(error.error)
  });
  }

  deleteSchedule(){
    this.db.deleteASchedule(this.deleteScheduleName).subscribe(data =>{
      alert(data);
      this.displaySchedules();
    },error => {
      alert(error.error)
    })
  }

  importCourses(schedule:any){
    this.savedCourses = this.scService.getSavedCourses()
    if(this.savedCourses.length > 0)
    {
      for(let c of this.savedCourses)
      {
          this.db.getCourseInfoBySubject(c.subject).subscribe(data=>{
          this.temp = data;
          this.temp = this.temp.result.filter(x=> x.class_name == c.class_name && x.component == c.component)
          this.courseCodes.push(this.temp[0].course_code+"")
          this.subjects.push(c.subject)
          this.components.push(c.component)
          if(this.components.length == this.savedCourses.length)
          {
            this.db.putCoursesIntoSchedule(schedule.schedule_name, this.subjects,this.courseCodes,this.components).subscribe(data =>{
              alert(data)
              this.resetVariables()
              this.scService.resetSavedCourses();
              this.savedCourses = [];
            },error => {
              alert(error.error)
            })
          }
        })
      }
    }
    else{
      alert("There are no saved courses")
    }
  }
  
  openTimeTable(sch: any){
    this.db.getScheduleContentsByName(sch.schedule_name).subscribe(data => {
      this.timetableSchName = sch.schedule_name;
      this.temp = data;
      this.temp = this.temp.result;
      if(this.temp[0].components != undefined)
      {
      this.courseCodes = this.temp[0].course_codes;
      this.subjects = this.temp[0].subjects;
      this.components = this.temp[0].components;
      for(let i = 0; i < this.components.length; i++)
      {
        this.db.getCourseTimeTable(this.subjects[i], this.courseCodes[i], this.components[i]).subscribe(data =>{
          this.temp = data;
          this.temp = this.temp.result;
          this.startTimes.push(this.temp[0].start_time);
          this.endTimes.push(this.temp[0].end_time);
          this.days.push(this.temp[0].days);
          console.log(this.days.length)
          if(this.days.length == this.components.length)
          {
            this.timetable = []
            for(let x = 0; x< this.components.length; x++)
            {
              this.temp = {
                subject: this.subjects[x],
                course_code: this.courseCodes[x],
                component: this.components[x],
                start_time: this.startTimes[x],
                end_time: this.endTimes[x],
                days: this.days[x]
              }
              this.timetable.push(this.temp);
            }
            this.results = undefined;
            this.resetVariables();
          }
        }, error => {
          alert(error.error)
        })
      }
    }
    else{
      alert("The selected schedule is empty")
    }
    },error=>{
      alert(error.error)
    })
  }

  filterBySubject(timetable:any){
    return timetable.filter(x => x.subject.indexOf(this.ttSearchSubject.toUpperCase()) > -1)
  }

  filterByCode(timetable:any){
    return timetable.filter(x => x.course_code.indexOf(this.ttSearchCode.toUpperCase()) > -1)
  }

  filterByComp(timetable:any){
    return timetable.filter(x => x.component.indexOf(this.ttSearchComp.toUpperCase()) > -1)
  }
  
  resetVariables(){
    this.subjects = [];
    this.courseCodes = [];
    this.components = [];
    this.days = [];
    this.startTimes = [];
    this.endTimes = [];
  }
}
