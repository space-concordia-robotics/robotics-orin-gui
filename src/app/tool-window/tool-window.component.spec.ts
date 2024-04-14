import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolWindowComponent } from './tool-window.component';

describe('ToolWindowComponent', () => {
  let component: ToolWindowComponent;
  let fixture: ComponentFixture<ToolWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToolWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
