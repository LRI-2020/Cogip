import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContactsListComponent } from './admin-contacts-list.component';

describe('AdminContactsComponent', () => {
  let component: AdminContactsListComponent;
  let fixture: ComponentFixture<AdminContactsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminContactsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminContactsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
