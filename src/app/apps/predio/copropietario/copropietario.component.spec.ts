import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopropietarioComponent } from './copropietario.component';

describe('CopropietarioComponent', () => {
  let component: CopropietarioComponent;
  let fixture: ComponentFixture<CopropietarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopropietarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopropietarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
