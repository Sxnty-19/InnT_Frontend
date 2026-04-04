import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LHabitaciones } from './l-habitaciones';

describe('LHabitaciones', () => {
  let component: LHabitaciones;
  let fixture: ComponentFixture<LHabitaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LHabitaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LHabitaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
