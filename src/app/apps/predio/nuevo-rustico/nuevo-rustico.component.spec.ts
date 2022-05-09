import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoRusticoComponent } from './nuevo-rustico.component';

describe('NuevoRusticoComponent', () => {
  let component: NuevoRusticoComponent;
  let fixture: ComponentFixture<NuevoRusticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoRusticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoRusticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
