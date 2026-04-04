import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ASolicitudes } from './a-solicitudes';

describe('ASolicitudes', () => {
  let component: ASolicitudes;
  let fixture: ComponentFixture<ASolicitudes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ASolicitudes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ASolicitudes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
