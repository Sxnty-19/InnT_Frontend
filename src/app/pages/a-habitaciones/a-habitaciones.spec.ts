import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AHabitaciones } from './a-habitaciones';

describe('AHabitaciones', () => {
  let component: AHabitaciones;
  let fixture: ComponentFixture<AHabitaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AHabitaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AHabitaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
