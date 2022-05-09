import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaModalComponent } from './caja-modal.component';

describe('CajaModalComponent', () => {
  let component: CajaModalComponent;
  let fixture: ComponentFixture<CajaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CajaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
