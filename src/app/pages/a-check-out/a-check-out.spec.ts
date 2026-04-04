import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ACheckOut } from './a-check-out';

describe('ACheckOut', () => {
  let component: ACheckOut;
  let fixture: ComponentFixture<ACheckOut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ACheckOut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ACheckOut);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
