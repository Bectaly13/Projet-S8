import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyPage } from './study.page';

describe('StudyPage', () => {
  let component: StudyPage;
  let fixture: ComponentFixture<StudyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
