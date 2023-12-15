import {Component, OnDestroy, OnInit} from '@angular/core';
import {Company} from "../../../models/company.model";
import {Contact} from "../../../models/contact.model";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CompaniesService} from "../../../services/companies.service";

@Component({
  selector: 'app-admin-company-details',
  templateUrl: './admin-company-details.component.html',
  styleUrl: './admin-company-details.component.scss'
})
export class AdminCompanyDetailsComponent implements OnInit,OnDestroy{
  company: Company | undefined;
  companyContacts:Contact[]=[]
  isLoadingCompanyDetails=true;
  isLoadingContacts=true;
  subscriptionsList:Subscription[]=[]
  constructor(private route:ActivatedRoute, private companiesService:CompaniesService) {
  }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.loadData(id);
    this.subscriptionsList.push(this.route.params.subscribe((params) => {
      let id = +params['id'];
      this.loadData(id);
    }))
  }

  loadData(id:number){
    this.subscriptionsList.push(this.companiesService.getCompanytById(id).subscribe(companyData => {
      this.isLoadingCompanyDetails=true;
      this.company = companyData;
      this.isLoadingCompanyDetails=false;
    }));

    this.subscriptionsList.push(this.companiesService.getContacts(id).subscribe(contacts =>{
       this.isLoadingContacts=true;
      this.companyContacts = contacts;
       this.isLoadingContacts=false;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }
}
