import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPersonaJuridicaComponent } from './registro-persona-juridica.component';

describe('RegistroPersonaJuridicaComponent', () => {
  let component: RegistroPersonaJuridicaComponent;
  let fixture: ComponentFixture<RegistroPersonaJuridicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroPersonaJuridicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPersonaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
