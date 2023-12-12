import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Invoice} from "../../models/invoice.model";
import {InvoicesService} from "../../services/invoices.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Route, Router, UrlSegment} from "@angular/router";
import {onWelcomePage} from "../../shared/helpers";
import {SearchPipe} from "../../pipes/search.pipe";
import {PaginationPipe} from "../../pipes/pagination.pipe";

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.scss'
})
@Injectable()
export class InvoicesListComponent implements OnInit, OnDestroy {

  searchFilter: string = '';
  onlyLastItems = false;
  fetchedInvoices: Invoice[] = []
  invoicesToDisplay: Invoice[] = []

  lastInvoiceCheckSub = new Subscription();
  invoicesSub: Subscription = new Subscription();
  routeSub: Subscription = new Subscription();

  itemsPerPage = 2;
  currentPage = 1;
  constructor(private invoicesService: InvoicesService, private route: ActivatedRoute, private searchPipe:SearchPipe, private router:Router) {
  }


  ngOnInit(): void {

    this.onlyLastItems = onWelcomePage(this.route.snapshot.url);
    this.lastInvoiceCheckSub = this.route.url.subscribe( urlSegments => {
      this.onlyLastItems = onWelcomePage(urlSegments);
    })

    this.invoicesSub = this.invoicesService.fetchInvoices().subscribe(invoicesData => {
      this.fetchedInvoices = invoicesData;
      this.invoicesToDisplay = invoicesData;
    })

    //Listen url for pagination pipe
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.itemsPerPage = (params['itemsPerPage'] && +params['itemsPerPage'] > 0) ? +params['itemsPerPage'] : this.itemsPerPage;
      this.currentPage = (params['currentPage'] && +params['currentPage'] > 0) ? +params['currentPage'] : this.currentPage;

      //keep query params is page is reload without init
      if (!this.onlyLastItems && (!this.route.snapshot.params['itemsPerPage'] || !this.route.snapshot.params['itemsPerPage'])) {
        this.router.navigate([], {queryParams: {'currentPage': this.currentPage.toString(), 'itemsPerPage': this.itemsPerPage}})
      }
    })
  }
  onFilterChanges(event: Event) {
    this.invoicesToDisplay = new Array(...this.searchPipe.transform(this.fetchedInvoices,
      (<HTMLInputElement>event.target).value, ['invoiceNumber','dueDate','company','createdAt']))
  }

  ngOnDestroy(): void {
    this.invoicesSub.unsubscribe();
    this.lastInvoiceCheckSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

}
