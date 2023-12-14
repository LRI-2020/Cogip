import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListHeaderComponent } from './admin-list-header.component';

describe('AdminListHeaderComponent', () => {
  let component: AdminListHeaderComponent;
  let fixture: ComponentFixture<AdminListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminListHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
