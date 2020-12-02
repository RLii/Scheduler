import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoCoursesComponent } from './demo-courses.component';

describe('DemoCoursesComponent', () => {
  let component: DemoCoursesComponent;
  let fixture: ComponentFixture<DemoCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
