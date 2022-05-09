import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BovedaModalComponent } from './boveda-modal.component';

describe('BovedaModalComponent', () => {
  let component: BovedaModalComponent;
  let fixture: ComponentFixture<BovedaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BovedaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BovedaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
