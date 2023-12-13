import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Contact} from "../../models/contact.model";
import {Subscriber, Subscription} from "rxjs";

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  company: Company | undefined;
  companyContacts:Contact[]=[]

  isLoading=false;
  subscriptionsList:Subscription[]=[]
  constructor(private route:ActivatedRoute, private companiesService:CompaniesService) {

  }

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    this.loadData(id);

    this.subscriptionsList.push(this.route.params.subscribe((params) => {
      this.isLoading=true;
      let id = +params['id'];
      this.loadData(id);
      this.isLoading=false;
    }))
  }

loadData(id:number){
  this.subscriptionsList.push(this.companiesService.getCompanytById(id).subscribe(companyData => {
    this.isLoading=true;
    this.company = companyData;
    this.isLoading=false;

  }));

  this.subscriptionsList.push(this.companiesService.getContacts(id).subscribe(contacts =>{
    this.isLoading=true;
    this.companyContacts = contacts;
    this.isLoading=false;
  }));
}

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

}
