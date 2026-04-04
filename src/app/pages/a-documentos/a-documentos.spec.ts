import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADocumentos } from './a-documentos';

describe('ADocumentos', () => {
  let component: ADocumentos;
  let fixture: ComponentFixture<ADocumentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ADocumentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ADocumentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
