import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvoiceDetailsComponent } from './admin-invoice-details.component';

describe('AdminInvoiceDetailsComponent', () => {
  let component: AdminInvoiceDetailsComponent;
  let fixture: ComponentFixture<AdminInvoiceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminInvoiceDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminInvoiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
