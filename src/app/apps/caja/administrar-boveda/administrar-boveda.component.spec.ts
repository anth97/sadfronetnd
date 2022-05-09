import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarBovedaComponent } from './administrar-boveda.component';

describe('AdministrarBovedaComponent', () => {
  let component: AdministrarBovedaComponent;
  let fixture: ComponentFixture<AdministrarBovedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrarBovedaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarBovedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
