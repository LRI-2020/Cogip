import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Invoice} from "../../../models/invoice.model";
import {InvoicesService} from "../../../services/invoices.service";
import {concatMap, forkJoin, map, mergeMap, of, Subscription, tap} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {DatePipe} from "@angular/common";
import {datesEquals} from "../../../shared/helpers";
import {NotificationsService} from "../../../services/notifications.service";
import {CompaniesService} from "../../../services/companies.service";
import {Company} from "../../../models/company.model";

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrl: './edit-invoice.component.scss'
})
export class EditInvoiceComponent implements OnInit {

  editMode = true;
  isLoading = false;
  originalInvoice: Invoice | undefined;
  subscriptionsList: Subscription[] = [];
  companiesNames: { company_id:string,company_name:string }[] = []

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
              private notificationsService: NotificationsService,
              private companiesService: CompaniesService) {
  }

  ngOnInit(): void {
    this.displayData();
  }

  onSave() {
    if (!this.invoiceForm.valid) {
      this.invoiceForm.markAllAsTouched()
    } else {
      this.processForm();
    }
  }

  onCancel() {
    this.displayData();
  }

  onBack() {
    this.navigationService.back("/admin");
  }

  private setFormValue(invoice ?: Invoice) {
    this.invoiceForm.setValue({
      id: invoice ? invoice.id : '',
      invoiceNumber: invoice ? invoice.invoiceNumber : '',
      invoiceCompany: invoice ? invoice.company_id : '',
      invoiceDueDate: invoice ? this.datepipe.transform(invoice.dueDate, 'yyyy-MM-dd') : '',
      invoiceCreatedDate: invoice ? this.datepipe.transform(invoice.createdAt, 'yyyy-MM-dd') : ''
    })
  }

  private updateInvoice(originalInvoice: Invoice) {
    let invoiceToUpdate = this.getUpdatedValues(originalInvoice);

    this.subscriptionsList.push(this.invoicesService.updateInvoice(invoiceToUpdate).subscribe({
      next: (response) => {
        this.displayData();
        this.notificationsService.success('Success', "The invoice has been updated");
        console.log(response);
      },
      error: (error) => {
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been updated");
        this.displayData();
        console.log(error);
      }
    }))

  }

  private createInvoice() {

    this.invoicesService.createInvoice(
      this.invoiceForm.get('invoiceNumber')?.value,
      this.invoiceForm.get('invoiceCompany')?.value,
      new Date(this.invoiceForm.get('invoiceDueDate')?.value))
      .subscribe({
      next: (response) => {
        this.notificationsService.success('Success', "The invoice has been created");
        this.router.navigate(['/admin/invoices']);
      },
      error: () => {
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been created");
      }
    })

  }

  private invoiceHasChanged() {
    return (this.originalInvoice?.invoiceNumber !== this.invoiceForm.get('invoiceNumber')?.value)
      || (this.originalInvoice?.company_id !== this.invoiceForm.get('invoiceCompany')?.value)
      || !datesEquals(this.originalInvoice ?
        this.originalInvoice.dueDate :
        new Date(), new Date(this.invoiceForm.get('invoiceDueDate')?.value));
  }

  private LoadData() {
    this.isLoading = true;
    //load companies names for select
    return this.companiesService.fetchCompanies().pipe(
      tap(companies => {
        companies.forEach(c => this.companiesNames.push({company_id:c.id, company_name:c.name}));
      }),
      //listen for params url
      concatMap(() => {
        return this.activeRoute.params
      }),
      //fulfill form if edit mode
      concatMap((params) => {
        this.editMode = params['id'] != null;
        if (this.editMode) {
          return this.invoicesService.getInvoiceWithCompany(params['id'])
        }
        return of(true)
      }))

  }

  private displayData() {
    //fulfillForm regarding data loaded
    this.LoadData().subscribe({
      next: result => {
        if (result instanceof Invoice) {
          this.setFormValue(result)
          this.originalInvoice = result;
        } else {
          this.setFormValue();
        }
        this.isLoading = false;
      },
      error: () => {
        this.notificationsService.error('Oh Oh 😕', "The invoice could not be loaded");
        this.router.navigate(['/admin/invoices']);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  //return invoice with forms values
  private getUpdatedValues(invoice: Invoice) {

    invoice.invoiceNumber = this.invoiceForm.get('invoiceNumber')?.value
    invoice.company_id = this.invoiceForm.get('invoiceCompany')?.value
    invoice.dueDate = new Date(this.invoiceForm.get('invoiceDueDate')?.value)
    return invoice;
  }

  private validForUpdate() {
    let id = this.activeRoute.snapshot.params['id'];
    return this.originalInvoice && this.originalInvoice.id === id && this.invoiceHasChanged();
  }

  private processForm() {
    if (!this.editMode) {
      try {
        this.createInvoice();
      } catch (e) {
        let error = (e instanceof Error ? e.message : 'An error has occured.');
        this.notificationsService.error('Oh Oh 😕', error + " The invoice has not been created");
      }
    } else {
      if (this.validForUpdate() && this.originalInvoice) {
        try {
          this.updateInvoice(this.originalInvoice)
        } catch (e) {
          let error = (e instanceof Error ? e.message : 'An error has occured.');
          this.notificationsService.error('Oh Oh 😕', error + " The invoice has not been updated");
        }
      }
    }
  }


}
