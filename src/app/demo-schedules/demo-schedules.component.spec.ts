import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoSchedulesComponent } from './demo-schedules.component';

describe('DemoSchedulesComponent', () => {
  let component: DemoSchedulesComponent;
  let fixture: ComponentFixture<DemoSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
