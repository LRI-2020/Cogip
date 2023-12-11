import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Invoice} from "../../models/invoice.model";
import {InvoicesService} from "../../services/invoices.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.scss'
})
@Injectable()
export class InvoicesListComponent implements OnInit, OnDestroy{

  searchFilter:string='';
  invoicesSub:Subscription = new Subscription();

  constructor(private invoicesService:InvoicesService) {
  }

  invoices:Invoice[]=[]

  ngOnInit(): void {
    this.invoicesSub = this.invoicesService.fetchInvoices().subscribe(invoicesData =>{
      this.invoices=invoicesData;
    })
  }

  ngOnDestroy(): void {
    this.invoicesSub.unsubscribe();
  }

}
