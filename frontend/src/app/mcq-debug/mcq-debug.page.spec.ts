import { ComponentFixture, TestBed } from '@angular/core/testing';
import { McqDebugPage } from './mcq-debug.page';

describe('McqDebugPage', () => {
  let component: McqDebugPage;
  let fixture: ComponentFixture<McqDebugPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(McqDebugPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
