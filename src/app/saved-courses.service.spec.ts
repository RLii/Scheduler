import { TestBed } from '@angular/core/testing';

import { SavedCoursesService } from './saved-courses.service';

describe('SavedCoursesService', () => {
  let service: SavedCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
