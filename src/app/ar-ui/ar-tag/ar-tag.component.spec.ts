import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArTagComponent } from './ar-tag.component';

describe('ArTagComponent', () => {
  let component: ArTagComponent;
  let fixture: ComponentFixture<ArTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
