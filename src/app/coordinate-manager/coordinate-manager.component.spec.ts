import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinateManagerComponent } from './coordinate-manager.component';

describe('CoordinateManagerComponent', () => {
  let component: CoordinateManagerComponent;
  let fixture: ComponentFixture<CoordinateManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinateManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoordinateManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
