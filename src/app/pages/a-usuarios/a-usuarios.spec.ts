import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AUsuarios } from './a-usuarios';

describe('AUsuarios', () => {
  let component: AUsuarios;
  let fixture: ComponentFixture<AUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
