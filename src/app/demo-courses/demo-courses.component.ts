import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { SavedCoursesService } from '../saved-courses.service'

@Component({
  selector: 'app-demo-courses',
  templateUrl: './demo-courses.component.html',
  styleUrls: ['./demo-courses.component.scss']
})
export class DemoCoursesComponent implements OnInit {

  results: any;

  //Searches
  searchBySubject: string;
  searchByClassName: string;
  searchByClassCode: string;
  searchByComponent: string;
  searchByKeyword: string;


  savedCourses: any[] = [];
  
  list = true;

  constructor(private db: DbService,
              private scService: SavedCoursesService) { }

  ngOnInit(): void {
    this.searchBySubject = "";
    this.searchByClassName ="";
    this.searchByClassCode = "";
    this.searchByComponent ="";
    this.searchByKeyword="";
    this.displayCourses();
  }

  //Search Functions
  filterResultsBySubject(results:any){
    return results.filter(x=> x.subject.indexOf(this.searchBySubject.toUpperCase()) > -1);
  }
  filterResultsByClassName(results:any){
    return results.filter(x=> x.class_name.indexOf(this.searchByClassName.toUpperCase()) > -1);
  }
  filterResultsByClassCode(results:any){
    return results.filter(x=> x.course_code.toString().indexOf(this.searchByClassCode.toUpperCase()) > -1);
  }
  filterResultsByComponent(results:any){
    return results.filter(x=> x.component.indexOf(this.searchByComponent.toUpperCase()) > -1);
  }
  filterResultsByKeyword(results:any){
    if(this.searchByKeyword.length >= 4)
    {
      return results.filter(x=> 
                                x.course_code.toString().indexOf(this.searchByKeyword.toUpperCase()) > -1 || 
                                x.class_name.indexOf(this.searchByKeyword.toUpperCase()) > -1)
    }
    else{
      return results;
    }
  }
  clearSearches(){
    this.searchByClassCode = "";
    this.searchByClassName = "";
    this.searchByComponent = "";
    this.searchBySubject = "";
    this.searchByKeyword = "";
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
