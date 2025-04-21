import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MCQPage } from './mcq.page';

describe('MCQPage', () => {
  let component: MCQPage;
  let fixture: ComponentFixture<MCQPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MCQPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
