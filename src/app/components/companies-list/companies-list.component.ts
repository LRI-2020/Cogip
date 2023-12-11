import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Subscription} from "rxjs";
import {onWelcomePage} from "../../shared/helpers";
import {ActivatedRoute} from "@angular/router";
import {SearchPipe} from "../../pipes/search.pipe";

@Injectable()
@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent implements OnInit, OnDestroy {

  constructor(private companiesService: CompaniesService, private route: ActivatedRoute, private searchPipe: SearchPipe) {
  }

  fetchedCompanies: Company[] = [];
  companiesToDisplay: Company[] = [];
  onlyLastCompanies = false;

  searchFilter: string = '';

  itemsPerPage = 2;
  currentPage = 1;

  companiesSub: Subscription = new Subscription();
  lastCompaniesCheckSub = new Subscription();
  routeSub = new Subscription();

  ngOnInit(): void {

    //Check if on welcome page - then display only 5 last items
    this.onlyLastCompanies = onWelcomePage(this.route.snapshot.url);
    this.lastCompaniesCheckSub = this.route.url.subscribe(urlSegments => {
      this.onlyLastCompanies = onWelcomePage(urlSegments);
    });

    //load data, displayed data and listen for changes
    this.companiesSub = this.companiesService.fetchInvoices().subscribe(companiesData => {
      this.fetchedCompanies = companiesData;
      this.companiesToDisplay = companiesData;
    });

    //Listen url for pagination pipe
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.itemsPerPage = (params['itemsPerPage'] && +params['itemsPerPage'] > 0) ? +params['itemsPerPage'] : this.itemsPerPage;
      this.currentPage = (params['currentPage'] && +params['currentPage'] > 0) ? +params['currentPage'] : this.itemsPerPage;
    })
  }

  ngOnDestroy(): void {
    this.companiesSub.unsubscribe();
    this.lastCompaniesCheckSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  onFilterChanges(event: Event) {
    this.companiesToDisplay = new Array(...this.searchPipe.transform(this.fetchedCompanies, (<HTMLInputElement>event.target).value, ['name','tva','country','type','createdAt']))
  }

}
