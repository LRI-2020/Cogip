import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Subscription} from "rxjs";
import {onWelcomePage} from "../../shared/helpers";
import {ActivatedRoute} from "@angular/router";

@Injectable()
@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent implements OnInit, OnDestroy{

  constructor(private companiesService:CompaniesService, private route:ActivatedRoute) {
  }
searchFilter:string='';
companies:Company[]=[];
companiesSub:Subscription = new Subscription();
onlyLastCompanies=false;
lastCompaniesCheckSub = new Subscription();

  ngOnInit(): void {
    this.onlyLastCompanies = onWelcomePage(this.route.snapshot.url);
    this.lastCompaniesCheckSub = this.route.url.subscribe(urlSegments => {
      this.onlyLastCompanies = onWelcomePage(urlSegments);
    })
    this.companiesSub = this.companiesService.fetchInvoices().subscribe(companiesData =>{
      this.companies=companiesData;
    })
  }

  ngOnDestroy(): void {
    this.companiesSub.unsubscribe();
    this.lastCompaniesCheckSub.unsubscribe();
  }


}
