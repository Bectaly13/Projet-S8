import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartMCQPage } from './start-mcq.page';

describe('StartMCQPage', () => {
  let component: StartMCQPage;
  let fixture: ComponentFixture<StartMCQPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StartMCQPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
