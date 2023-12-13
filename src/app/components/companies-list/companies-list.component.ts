import {Component, Injectable, Input, OnDestroy, OnInit} from '@angular/core';
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Helpers} from "../../shared/helpers";

@Injectable()
@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent implements OnInit, OnDestroy {

  constructor(private companiesService: CompaniesService,
              private route: ActivatedRoute,
              private helpers: Helpers,
              private router: Router) {
  }

  @Input() lastItemsParams = {count: -1, prop: ''};
  @Input() dataFilter = {prop: '', value: ''};
  @Input() pagination = true;

  fetchedData: Company[] = [];
  dataToDisplay: Company[] = [];
  onlyLastItems = false;

  paginationInfos: { itemsPerPage: number, currentPage: number } = {itemsPerPage: 2, currentPage: 1};

  isLoading = false;

  subscriptionsList: Subscription[] = [];
  companiesSub: Subscription = new Subscription();
  routeSub = new Subscription();

  ngOnInit(): void {

    //load data, displayed data and listen for changes
      this.loadData();

    //Listen url for pagination pipe
    this.subscriptionsList.push(
      this.route.queryParams.subscribe(params => {

        this.paginationInfos.itemsPerPage = (params['itemsPerPage'] && +params['itemsPerPage'] > 0) ? +params['itemsPerPage'] : this.paginationInfos.itemsPerPage;
        this.paginationInfos.currentPage = (params['currentPage'] && +params['currentPage'] > 0) ? +params['currentPage'] : this.paginationInfos.currentPage;

        //keep query params is page is reload without init
        if (!this.onlyLastItems && (!this.route.snapshot.params['itemsPerPage'] || !this.route.snapshot.params['itemsPerPage'])) {
          this.router.navigate([], {queryParams: {'currentPage': this.paginationInfos.currentPage.toString(), 'itemsPerPage': this.paginationInfos.itemsPerPage}})
        }
      }));
  }

  ngOnDestroy(): void {
    this.companiesSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  searchData(event: Event) {
    console.log('search triggered!');
    this.dataToDisplay = this.helpers.searchData(this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams),
      (<HTMLInputElement>event.target).value,
      ['name', 'tva', 'country', 'type', 'createdAt']);
  }

  loadData() {
    this.subscriptionsList.push(
      this.companiesSub = this.companiesService.fetchCompanies().subscribe((companiesData: Company[]) => {
       this.isLoading=true;

        this.fetchedData = companiesData;
        this.onlyLastItems = (this.lastItemsParams.count > 0 && this.lastItemsParams.prop !== '');
        this.dataToDisplay = this.helpers.filterData(this.fetchedData, this.dataFilter.prop, this.dataFilter.value, this.lastItemsParams) as Company[];

        this.isLoading=false;

      }));
  }

}
