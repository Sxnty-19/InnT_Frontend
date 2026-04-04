import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AReservas } from './a-reservas';

describe('AReservas', () => {
  let component: AReservas;
  let fixture: ComponentFixture<AReservas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AReservas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AReservas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
