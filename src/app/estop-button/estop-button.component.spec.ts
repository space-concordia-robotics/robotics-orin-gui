import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstopButtonComponent } from './estop-button.component';

describe('EstopButtonComponent', () => {
  let component: EstopButtonComponent;
  let fixture: ComponentFixture<EstopButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstopButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstopButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
