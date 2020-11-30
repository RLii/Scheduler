import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedCoursesComponent } from './saved-courses.component';

describe('SavedCoursesComponent', () => {
  let component: SavedCoursesComponent;
  let fixture: ComponentFixture<SavedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
