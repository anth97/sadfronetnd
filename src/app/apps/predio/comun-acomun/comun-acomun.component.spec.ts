import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunAcomunComponent } from './comun-acomun.component';

describe('ComunAcomunComponent', () => {
  let component: ComunAcomunComponent;
  let fixture: ComponentFixture<ComunAcomunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComunAcomunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunAcomunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
