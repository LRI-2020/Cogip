import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvoicesListComponent } from './admin-invoices-list.component';

describe('AdminInvoicesComponent', () => {
  let component: AdminInvoicesListComponent;
  let fixture: ComponentFixture<AdminInvoicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminInvoicesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInvoicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
