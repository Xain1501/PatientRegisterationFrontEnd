import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredPatients } from './registered-patients';

describe('RegisteredPatients', () => {
  let component: RegisteredPatients;
  let fixture: ComponentFixture<RegisteredPatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredPatients]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredPatients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
