import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Invoice} from "../../../models/invoice.model";
import {InvoicesService} from "../../../services/invoices.service";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {DatePipe} from "@angular/common";
import {datesEquals} from "../../../shared/helpers";
import {NotificationType} from "../../../models/notification.model";
import {NotificationsService} from "../../../services/notifications.service";

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
        let id = +params['id'];
        this.fullFillForm(id);
      } else {
        this.isLoading = false;
      }
    }));
  }

  private fullFillForm(id: number) {
    this.isLoading = true;
    this.subscriptionsList.push(this.invoicesService.getInvoiceBy(id).subscribe({
      next: invoiceData => {
        this.originalInvoice = invoiceData;
        this.setFormValue(this.originalInvoice);
        this.isLoading = false;
      },
      error: error => {
        this.notificationsService.notify({
          title: 'Oh Oh 😕',
          type: NotificationType.error,
          message: "The invoice could not be loaded",
        });
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

  private setFormValue(invoice?: Invoice) {
    this.invoiceForm.setValue({
      id: invoice ? invoice.id : '',
      invoiceNumber: invoice ? invoice.invoiceNumber : '',
      invoiceCompany: invoice ? invoice.company : '',
      invoiceDueDate: invoice ? this.datepipe.transform(invoice.dueDate, 'yyyy-MM-dd') : '',
      invoiceCreatedDate: invoice ? this.datepipe.transform(invoice.createdAt, 'yyyy-MM-dd') : ''
    })
  }

  private updateInvoice() {
    let id = +this.activeRoute.snapshot.params['id'];
    if (this.originalInvoice && this.originalInvoice.id === id && this.invoiceHasChanged()) {

      this.originalInvoice.invoiceNumber = this.invoiceForm.get('invoiceNumber')?.value
      this.originalInvoice.company = this.invoiceForm.get('invoiceCompany')?.value
      this.originalInvoice.dueDate = new Date(this.invoiceForm.get('invoiceDueDate')?.value)

      try {
        this.invoicesService.updateInvoice(this.originalInvoice).subscribe({
          next: (response) => {
            if (response.ok && this.originalInvoice) {
              this.fullFillForm(this.originalInvoice.id);
              this.notificationsService.notify({
                title: 'Success',
                type: NotificationType.success,
                message: "The invoice has been updated",
              });
            }
          },
          error: (error) => {
            this.notificationsService.notify({
              title: 'Oh Oh 😕',
              type: NotificationType.error,
              message: "The invoice could not be updated",
            });
            if (this.originalInvoice) {
              this.fullFillForm(this.originalInvoice.id);
            } else {
              this.router.navigate(['/admin/invoices']);
            }
          }
        })
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    } else {
      console.log('Error - Invoice has not been updated');
    }

  }

  private createInvoice() {

    try {
      this.invoicesService.createInvoice(this.invoiceForm.get('invoiceNumber')?.value,
        this.invoiceForm.get('invoiceCompany')?.value,
        new Date(this.invoiceForm.get('invoiceDueDate')?.value)).subscribe({
        next: (response) => {
          if (response.ok) {
            this.router.navigate(['/invoices']);
          }
        },
        error: (error) => {
          //TODO notifications here
          console.log(error);
        }
      })
    } catch (e) {
      if (e instanceof Error)
        console.log('Error - Invoice has not been created : ' + e.message);
      else
        console.log('Error - Invoice has not been created');
    }
  }

  private invoiceHasChanged() {
    return (this.originalInvoice?.invoiceNumber !== this.invoiceForm.get('invoiceNumber')?.value)
      || (this.originalInvoice?.company !== this.invoiceForm.get('invoiceCompany')?.value)
      || !datesEquals(this.originalInvoice ? this.originalInvoice.dueDate : new Date(), new Date(this.invoiceForm.get('invoiceDueDate')?.value));
  }


}
