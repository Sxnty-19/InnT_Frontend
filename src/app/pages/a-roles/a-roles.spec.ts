import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ARoles } from './a-roles';

describe('ARoles', () => {
  let component: ARoles;
  let fixture: ComponentFixture<ARoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ARoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ARoles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
