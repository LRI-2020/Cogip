import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Invoice} from "../../../models/invoice.model";
import {InvoicesService} from "../../../services/invoices.service";
import {map, mergeAll, mergeMap, Subscription, toArray} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {DatePipe} from "@angular/common";
import {datesEquals} from "../../../shared/helpers";
import {NotificationsService} from "../../../services/notifications.service";
import {CompaniesService} from "../../../services/companies.service";

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrl: './edit-invoice.component.scss'
})
export class EditInvoiceComponent implements OnInit {

  editMode = true;
  isLoading = true;
  originalInvoice: Invoice | undefined;
  subscriptionsList: Subscription[] = [];

  invoiceForm: FormGroup = new FormGroup({
    "id": new FormControl(''),
    "invoiceNumber": new FormControl('', Validators.required),
    "invoiceCompany": new FormControl('', Validators.required),
    "invoiceDueDate": new FormControl('', Validators.required),
    "invoiceCreatedDate": new FormControl('')
  })

  constructor(private activeRoute: ActivatedRoute,
              private invoicesService: InvoicesService,
              private navigationService: NavigationService,
              private datepipe: DatePipe,
              private router: Router,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.subscriptionsList.push(this.activeRoute.params.subscribe((params) => {
      this.editMode = params['id'] != null;
      if (this.editMode) {
        let id = params['id'];
        this.fullFillForm(id);
      } else {
        this.isLoading = false;
      }
    }));
  }

  private fullFillForm(id: string) {
    this.isLoading = true;
    this.subscriptionsList.push(this.invoicesService.getInvoiceWithCompany(id).subscribe({
      next: invoiceData => {
        this.originalInvoice = invoiceData;
        this.setFormValue(this.originalInvoice);
        this.isLoading = false;
      },
      error: () => {
        this.notificationsService.error('Oh Oh 😕', "The invoice could not be loaded");
        this.router.navigate(['/admin/invoices']);
      }
    }));
  }


  onSave() {
    if (this.invoiceForm.valid) {
      if (this.editMode) {
        this.updateInvoice()
      } else {
        this.createInvoice()
      }
    } else {
      this.invoiceForm.markAllAsTouched();
    }
  }

  onCancel() {

    if (this.editMode && this.originalInvoice) {
      this.fullFillForm(this.originalInvoice.id);
    } else {
      this.setFormValue();
    }
  }

  onBack() {
    this.navigationService.back("/admin");
  }

  private setFormValue(invoice ?: Invoice) {
    this.invoiceForm.setValue({
      id: invoice ? invoice.id : '',
      invoiceNumber: invoice ? invoice.invoiceNumber : '',
      invoiceCompany: invoice ? invoice.company_name : '',
      invoiceDueDate: invoice ? this.datepipe.transform(invoice.dueDate, 'yyyy-MM-dd') : '',
      invoiceCreatedDate: invoice ? this.datepipe.transform(invoice.createdAt, 'yyyy-MM-dd') : ''
    })
  }

  private  updateInvoice() {
    let id = this.activeRoute.snapshot.params['id'];
    if (this.originalInvoice && this.originalInvoice.id === id && this.invoiceHasChanged()) {

      this.originalInvoice.invoiceNumber = this.invoiceForm.get('invoiceNumber')?.value
      this.originalInvoice.company_id = this.invoiceForm.get('invoiceCompany')?.value
      this.originalInvoice.dueDate = new Date(this.invoiceForm.get('invoiceDueDate')?.value)

      try {
        this.invoicesService.updateInvoice(this.originalInvoice).subscribe({
          next: (response) => {
            if (response.ok && this.originalInvoice) {
              this.fullFillForm(this.originalInvoice.id);
              this.notificationsService.success('Success', "The invoice has been updated");
            }
          },
          error: () => {
            this.notificationsService.error('Oh Oh 😕', "The invoice has not been updated");
            if (this.originalInvoice) {
              this.fullFillForm(this.originalInvoice.id);
            } else {
              this.router.navigate(['/admin/invoices']);
            }
          }
        })
      } catch (e) {
        if (e instanceof Error) {
          this.notificationsService.error('Oh Oh 😕', "The invoice has not been updated : " + e.message);
        }
      }
    } else {
      this.notificationsService.error('Oh Oh 😕', "The invoice has not been updated");
    }

  }

  private  createInvoice() {

    try {
      this.invoicesService.createInvoice(this.invoiceForm.get('invoiceNumber')?.value,
        this.invoiceForm.get('invoiceCompany')?.value,
        new Date(this.invoiceForm.get('invoiceDueDate')?.value)).subscribe({
        next: (response) => {
          if (response.ok) {
            this.notificationsService.success('Success', "The invoice has been created");
            this.router.navigate(['/invoices']);
          }
        },
        error: () => {
          this.notificationsService.error('Oh Oh 😕', "The invoice has not been created");
        }
      })
    } catch (e) {
      if (e instanceof Error)
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been created : " + e.message);

      else
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been created");
    }
  }

  private  invoiceHasChanged() {
    return (this.originalInvoice?.invoiceNumber !== this.invoiceForm.get('invoiceNumber')?.value)
      || (this.originalInvoice?.company_id !== this.invoiceForm.get('invoiceCompany')?.value)
      || !datesEquals(this.originalInvoice ? this.originalInvoice.dueDate : new Date(), new Date(this.invoiceForm.get('invoiceDueDate')?.value));
  }


}
