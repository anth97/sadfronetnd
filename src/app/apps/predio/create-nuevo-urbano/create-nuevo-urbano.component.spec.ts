import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNuevoUrbanoComponent } from './create-nuevo-urbano.component';

describe('CreateNuevoUrbanoComponent', () => {
  let component: CreateNuevoUrbanoComponent;
  let fixture: ComponentFixture<CreateNuevoUrbanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNuevoUrbanoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNuevoUrbanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
