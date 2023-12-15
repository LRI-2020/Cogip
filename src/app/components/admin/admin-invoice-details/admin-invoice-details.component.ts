import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../../models/contact.model";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ContactsService} from "../../../services/contacts.service";
import {InvoicesService} from "../../../services/invoices.service";
import {Invoice} from "../../../models/invoice.model";

@Component({
  selector: 'app-admin-invoice-details',
  templateUrl: './admin-invoice-details.component.html',
  styleUrl: './admin-invoice-details.component.scss'
})
export class AdminInvoiceDetailsComponent implements OnInit, OnDestroy {

  invoice:Invoice | undefined;
  isLoading = true;
  subscriptionsList: Subscription[] = [];

  constructor(private route: ActivatedRoute, private invoicesService: InvoicesService) {

  }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.loadData(id);

    this.subscriptionsList.push(this.route.params.subscribe((params) => {
      let id = +params['id'];
      this.loadData(id);
    }))

  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  loadData(id: number) {
    this.subscriptionsList.push(this.invoicesService.getInvoiceBy(id).subscribe(invoicesData => {
      this.isLoading = true;
      this.invoice = invoicesData;
      this.isLoading = false;
    },
      error =>{
      console.log(error);
      this.isLoading=false;
      }));
  }


}
