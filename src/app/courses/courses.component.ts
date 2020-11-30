import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { SavedCoursesService } from '../saved-courses.service'

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  results: any;

  searchBySubject: string;

  searchByClassName:string;

  savedCourses: any[] = [];
  
  list = true;

  constructor(private db: DbService,
              private scService: SavedCoursesService) { }

  ngOnInit(): void {
    this.searchBySubject = "";
    this.searchByClassName ="";
    this.displayCourses();
  }

  filterResultsBySubject(results:any){
    return results.filter(x=> x.subject.indexOf(this.searchBySubject.toUpperCase()) > -1)
  }
  filterResultsByClassName(results:any){
    return results.filter(x=> x.class_name.indexOf(this.searchByClassName.toUpperCase()) > -1)
  }

  displayCourses(){
    this.db.getCourses().subscribe(data => {
      this.results = data
      this.results = this.results.result
    })
  }

  addToSavedCourses(x: any){
    this.savedCourses.push(x)
    this.scService.addToSavedCourses(x)
  }
  

}
