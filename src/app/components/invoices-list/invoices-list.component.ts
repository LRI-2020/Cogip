import {Component, Injectable, OnInit} from '@angular/core';
import {Invoice} from "../../models/invoice.model";
import {InvoicesService} from "../../services/invoices-service";

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.scss'
})
@Injectable()
export class InvoicesListComponent implements OnInit {

  constructor(private invoicesService:InvoicesService) {
  }

  invoices:Invoice[]=[]

  ngOnInit(): void {
    this.invoicesService.fetchInvoices().subscribe(invoicesData =>{
      this.invoices=invoicesData;
    })
  }

}
