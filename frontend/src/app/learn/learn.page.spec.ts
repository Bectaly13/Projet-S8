import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearnPage } from './learn.page';

describe('LearnPage', () => {
  let component: LearnPage;
  let fixture: ComponentFixture<LearnPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
