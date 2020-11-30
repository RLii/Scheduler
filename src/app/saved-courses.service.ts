import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SavedCoursesService {
  savedCourses: any[] = []

  constructor() { }

  getSavedCourses(){
    return this.savedCourses;
  }
  addToSavedCourses(x:any){
    this.savedCourses.push(x);
  }
  resetSavedCourses(){
    this.savedCourses= [];
  }
}
