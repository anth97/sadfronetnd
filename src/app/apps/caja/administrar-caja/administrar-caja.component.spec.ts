import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarCajaComponent } from './administrar-caja.component';

describe('AdministrarCajaComponent', () => {
  let component: AdministrarCajaComponent;
  let fixture: ComponentFixture<AdministrarCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrarCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
