import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ACheckIn } from './a-check-in';

describe('ACheckIn', () => {
  let component: ACheckIn;
  let fixture: ComponentFixture<ACheckIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ACheckIn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ACheckIn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
