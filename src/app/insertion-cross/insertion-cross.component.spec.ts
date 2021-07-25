import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertionCrossComponent } from './insertion-cross.component';

describe('InsertionCrossComponent', () => {
  let component: InsertionCrossComponent;
  let fixture: ComponentFixture<InsertionCrossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertionCrossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertionCrossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
