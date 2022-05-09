import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementosModalComponent } from './complementos-modal.component';

describe('ComplementosModalComponent', () => {
  let component: ComplementosModalComponent;
  let fixture: ComponentFixture<ComplementosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplementosModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplementosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
