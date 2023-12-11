import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Invoice} from "../../models/invoice.model";
import {InvoicesService} from "../../services/invoices.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";
import {onWelcomePage} from "../../shared/helpers";

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.scss'
})
@Injectable()
export class InvoicesListComponent implements OnInit, OnDestroy {

  searchFilter: string = '';
  isLastInvoices = false;
  lastInvoiceCheckSub = new Subscription();
  invoicesSub: Subscription = new Subscription();

  constructor(private invoicesService: InvoicesService, private router: Router, private route: ActivatedRoute) {
  }

  invoices: Invoice[] = []

  ngOnInit(): void {
    this.isLastInvoices = onWelcomePage(this.route.snapshot.url);
    this.lastInvoiceCheckSub = this.route.url.subscribe( urlSegments => {
      this.isLastInvoices = onWelcomePage(urlSegments);
    })
    this.invoicesSub = this.invoicesService.fetchInvoices().subscribe(invoicesData => {
      this.invoices = invoicesData;
    })
  }

  ngOnDestroy(): void {
    this.invoicesSub.unsubscribe();
    this.lastInvoiceCheckSub.unsubscribe();
  }

}
