import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Subscription} from "rxjs";
import {onWelcomePage} from "../../shared/helpers";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchPipe} from "../../pipes/search.pipe";
import {PaginationPipe} from "../../pipes/pagination.pipe";

@Injectable()
@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent implements OnInit, OnDestroy {

  constructor(private companiesService: CompaniesService,
              private route: ActivatedRoute,
              private searchPipe: SearchPipe,
              private router: Router) {
  }

  fetchedData: Company[] = [];
  dataToDisplay: Company[] = [];
  @Input()onlyLastItems = false;

  itemsPerPage = 2;
  currentPage = 1;

  companiesSub: Subscription = new Subscription();
  routeSub = new Subscription();

  ngOnInit(): void {

    //load data, displayed data and listen for changes
    this.companiesSub = this.companiesService.fetchInvoices().subscribe(companiesData => {
      this.fetchedData = companiesData;
      this.dataToDisplay = companiesData;
    });

    //Listen url for pagination pipe
    this.routeSub = this.route.queryParams.subscribe(params => {

      this.itemsPerPage = (params['itemsPerPage'] && +params['itemsPerPage'] > 0) ? +params['itemsPerPage'] : this.itemsPerPage;
      this.currentPage = (params['currentPage'] && +params['currentPage'] > 0) ? +params['currentPage'] : this.currentPage;

      //keep query params is page is reload without init
      if (!this.onlyLastItems && (!this.route.snapshot.params['itemsPerPage'] || !this.route.snapshot.params['itemsPerPage'])) {
        this.router.navigate([], {queryParams: {'currentPage': this.currentPage.toString(), 'itemsPerPage': this.itemsPerPage}})
      }
    });
  }

  ngOnDestroy(): void {
    this.companiesSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  filterData(event: Event) {
    this.dataToDisplay = new Array(...this.searchPipe.transform(this.fetchedData, (<HTMLInputElement>event.target).value, ['name', 'tva', 'country', 'type', 'createdAt']))
  }
}
