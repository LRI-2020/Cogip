import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Invoice} from "../../../models/invoice.model";
import {InvoicesService} from "../../../services/invoices.service";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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

  invoiceForm: FormGroup = new FormGroup({
    "id": new FormControl('', Validators.required),
    "invoiceNumber": new FormControl('', Validators.required),
    "invoiceCompany": new FormControl('', Validators.required),
    "invoiceDueDate": new FormControl('', Validators.required),
    "invoiceCreatedDate": new FormControl('')
  })

  constructor(private activeRoute: ActivatedRoute, private invoicesService: InvoicesService) {
  }

  ngOnInit(): void {
    this.subscriptionsList.push(this.activeRoute.params.subscribe((params) => {
      this.editMode = params['id'] != null;
      if (this.editMode) {
        let id = +params['id'];
        this.fullFillForm(id);
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
      this.isLoading = true;
    }));
  }

  onSave() {

  }

  onCancel() {

  }

  onBack() {

  }

  private setFormValue(invoice: Invoice) {
    this.invoiceForm.setValue({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceCompany: invoice.company,
      invoiceDueDate: invoice.dueDate,
      invoiceCreatedDate: invoice.createdAt
    })
  }
}
