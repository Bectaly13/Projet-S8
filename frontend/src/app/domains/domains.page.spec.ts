import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomainsPage } from './domains.page';

describe('DomainsPage', () => {
  let component: DomainsPage;
  let fixture: ComponentFixture<DomainsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
