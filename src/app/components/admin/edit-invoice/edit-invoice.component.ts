import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Invoice} from "../../../models/invoice.model";
import {InvoicesService} from "../../../services/invoices.service";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {DatePipe} from "@angular/common";

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
    "id": new FormControl('', Validators.required),
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
      }
      else{
        this.isLoading=false;
      }
    }));
  }


  private fullFillForm(id: number) {
    this.subscriptionsList.push(this.invoicesService.getInvoiceBy(id).subscribe(invoiceData => {
      this.isLoading = true;
      this.originalInvoice = invoiceData;
      if (this.originalInvoice) {
        this.setFormValue(this.originalInvoice);
      }
      this.isLoading = false;
    }));
  }

  onSave() {

  }

  onCancel() {
    if (this.originalInvoice) {
      this.setFormValue(this.originalInvoice);
    }
    else{
      this.setFormValue();
    }
  }

  onBack() {
    this.navigationService.back("/admin");
  }

  private setFormValue(invoice?: Invoice) {
    this.invoiceForm.setValue({
      id: invoice? invoice.id:'',
      invoiceNumber: invoice?invoice.invoiceNumber:'',
      invoiceCompany: invoice?invoice.company:'',
      invoiceDueDate: invoice?this.datepipe.transform(invoice.dueDate, 'yyyy-MM-dd'):'',
      invoiceCreatedDate: invoice?this.datepipe.transform(invoice.createdAt, 'yyyy-MM-dd'):''
    })
  }
}
