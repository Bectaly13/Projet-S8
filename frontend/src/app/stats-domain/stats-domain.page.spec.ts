import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsDomainPage } from './stats-domain.page';

describe('StatsDomainPage', () => {
  let component: StatsDomainPage;
  let fixture: ComponentFixture<StatsDomainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsDomainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
