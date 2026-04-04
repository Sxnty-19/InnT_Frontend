import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AEstadisticas } from './a-estadisticas';

describe('AEstadisticas', () => {
  let component: AEstadisticas;
  let fixture: ComponentFixture<AEstadisticas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AEstadisticas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AEstadisticas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
