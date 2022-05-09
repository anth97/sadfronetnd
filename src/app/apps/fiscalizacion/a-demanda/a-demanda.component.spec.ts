import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADemandaComponent } from './a-demanda.component';

describe('ADemandaComponent', () => {
  let component: ADemandaComponent;
  let fixture: ComponentFixture<ADemandaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ADemandaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ADemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
