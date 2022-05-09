import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPersonaNaturalComponent } from './registro-persona-natural.component';

describe('RegistroPersonaNaturalComponent', () => {
  let component: RegistroPersonaNaturalComponent;
  let fixture: ComponentFixture<RegistroPersonaNaturalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroPersonaNaturalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPersonaNaturalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
