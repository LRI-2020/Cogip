import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Invoice} from "../../../models/invoice.model";
import {InvoicesService} from "../../../services/invoices.service";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {DatePipe, formatDate} from "@angular/common";
import {datesEquals, dateToCorrectFormat} from "../../../shared/helpers";

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
              private datepipe: DatePipe) {
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
      this.subscriptionsList.push(this.invoicesService.getInvoiceBy(id).subscribe(invoiceData => {
      this.originalInvoice = invoiceData;
      if (this.originalInvoice) {
        this.setFormValue(this.originalInvoice);
      }
      this.isLoading = false;
    }));
  }

  onSave() {
    if(this.invoiceForm.valid){
      if (this.editMode) {
        this.updateInvoice()
      } else {
        this.createInvoice()
      }
    }
    else{
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
        this.invoicesService.updateInvoice(this.originalInvoice);
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

    try{
      this.invoicesService.createInvoice(this.invoiceForm.get('invoiceNumber')?.value,
        this.invoiceForm.get('invoiceCompany')?.value,
        new Date(this.invoiceForm.get('invoiceDueDate')?.value))
        .subscribe(responseData =>{
        console.log(responseData)
      },error => {
        console.log(error);
      })

    }catch(e){
      if(e instanceof Error)
        console.log('Error - Invoice has not been created : ' + e.message);
      else
        console.log('Error - Invoice has not been created');
    }
  }

  private invoiceHasChanged() {
   return (this.originalInvoice?.invoiceNumber !== this.invoiceForm.get('invoiceNumber')?.value)
    || (this.originalInvoice?.company !== this.invoiceForm.get('invoiceCompany')?.value)
    || !datesEquals(this.originalInvoice? this.originalInvoice.dueDate:new Date(), new Date(this.invoiceForm.get('invoiceDueDate')?.value));
  }


}
