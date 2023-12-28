import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Invoice} from "../../../models/invoice.model";
import {InvoicesService} from "../../../services/invoices.service";
import {catchError, concatMap, of, Subscription, tap} from "rxjs";
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
  companiesNames: { company_id: string, company_name: string }[] = []

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
    this.displayData()
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

    this.subscriptionsList.push(
      this.invoicesService.updateInvoice(invoiceToUpdate).pipe(
        concatMap(response => {
          return this.LoadData();
        })
      )
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.notificationsService.success('Success', "The invoice has been updated");
          },
          error: () => {
            this.isLoading = false;
            this.notificationsService.error('Oh Oh 😕', "The invoice has not been updated");
          }
        }))

  }

  private createInvoice() {
    try {
        this.invoicesService.createInvoice(
          this.invoiceForm.get('invoiceNumber')?.value,
          this.invoiceForm.get('invoiceCompany')?.value,
          new Date(this.invoiceForm.get('invoiceDueDate')?.value))
           .subscribe({
            next: () => {
              this.notificationsService.success('Success', "The invoice has been created");
              this.router.navigate(['/admin/invoices']);
            },
            error: (e) => {
              let error = e instanceof Error ? e.message + '.' : '';
              this.notificationsService.error('Oh Oh 😕', error + "The invoice has not been created");
            }
           })
    } catch (e) {
      let error = e instanceof Error ? e.message + '.' : '';
      this.notificationsService.error('Oh Oh 😕', error + " The invoice has not been created");
      this.displayData();
    }


  }

  private invoiceHasChanged() {
    return (this.originalInvoice?.invoiceNumber !== this.invoiceForm.get('invoiceNumber')?.value)
      || (this.originalInvoice?.company_id !== this.invoiceForm.get('invoiceCompany')?.value)
      || !datesEquals(this.originalInvoice ?
        this.originalInvoice.dueDate :
        new Date(), new Date(this.invoiceForm.get('invoiceDueDate')?.value));
  }

  private loadCompaniesNames() {
    return this.companiesService.fetchCompanies().pipe(
      tap(companies => {
        this.setCompaniesNames(companies);
      }));
  }

  private LoadData() {
    return this.loadCompaniesNames().pipe(
      concatMap(() => {
        return this.loadInvoice();
      }))

  }

  private displayData() {
    this.subscriptionsList.push(
      this.LoadData().subscribe({
        next: () => {
          this.isLoading = false
        },
        error: () => {
          this.isLoading = false;
          this.notificationsService.error('Oh Oh 😕', "The invoice could not be loaded");
          this.router.navigate(['/admin/invoices']);
        }
      })
    )
  }

  //return invoice with updated values
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
      this.createInvoice();
    } else {
      if (this.validForUpdate() && this.originalInvoice) {
        this.updateInvoice(this.originalInvoice)
      }
    }
  }

  onDelete() {
    let id = this.activeRoute.snapshot.params['id'];
    if (this.originalInvoice?.id === id) {
      try {
        this.subscriptionsList.push(this.invoicesService.deleteInvoice(id).subscribe({
          next: () => {
            this.notificationsService.success('Success', "The invoice has been deleted");
            this.router.navigate(['/admin/invoices'])
          },
          error: () => {
            this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted");
          }
        }));
      } catch (e) {
        let error = (e instanceof Error) ? e.message : 'An error occured.'
        this.notificationsService.error('Oh Oh 😕', error + "The invoice has not been deleted : ");
      }
    }

  }

  private setCompaniesNames(companies: Company[]) {
    this.companiesNames = [];
    companies.forEach(c => this.companiesNames.push({company_id: c.id, company_name: c.name}));
  }

  private loadInvoice() {
    return this.activeRoute.params.pipe(
      concatMap(params => {
        this.isLoading = true;
        this.editMode = params['id'] != null;
        if (this.editMode) {
          return this.invoicesService.getInvoiceWithCompany(params['id']).pipe(
            tap(result => {
              this.setFormValue(result)
              this.originalInvoice = result;
            }))
        } else {
          this.setFormValue();
          return of(true)
        }
      }),
    )
  }
}
