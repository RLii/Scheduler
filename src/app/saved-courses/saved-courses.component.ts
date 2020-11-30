import { Component, OnInit, Input } from '@angular/core';
import { SavedCoursesService } from '../saved-courses.service'
@Component({
  selector: 'app-saved-courses',
  templateUrl: './saved-courses.component.html',
  styleUrls: ['./saved-courses.component.scss']
})
export class SavedCoursesComponent implements OnInit {

  @Input() savedCourses: any[] = []; 

  constructor(private scService: SavedCoursesService) { }

  ngOnInit(): void {
    this.savedCourses = this.scService.getSavedCourses();
  }
 
  resetList(){
    this.scService.resetSavedCourses();
    this.savedCourses = this.scService.getSavedCourses();
  }
}
