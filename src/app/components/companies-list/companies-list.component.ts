import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Subscription} from "rxjs";

@Injectable()
@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent implements OnInit, OnDestroy{

  constructor(private companiesService:CompaniesService) {
  }
searchFilter:string='';
companies:Company[]=[];
companiesSub:Subscription = new Subscription();

  ngOnInit(): void {
    this.companiesSub = this.companiesService.fetchInvoices().subscribe(companiesData =>{
      this.companies=companiesData;
    })
  }

  ngOnDestroy(): void {
    this.companiesSub.unsubscribe();
  }


}
