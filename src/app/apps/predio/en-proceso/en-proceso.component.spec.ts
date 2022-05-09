import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnProcesoComponent } from './en-proceso.component';

describe('EnProcesoComponent', () => {
  let component: EnProcesoComponent;
  let fixture: ComponentFixture<EnProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnProcesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
