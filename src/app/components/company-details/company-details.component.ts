import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Contact} from "../../models/contact.model";

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent {
  company: Company | undefined;
  companyContacts:Contact[]=[]
  constructor(private route:ActivatedRoute, private companiesService:CompaniesService) {
    let id = +this.route.snapshot.params['id'];
    this.companiesService.getCompanytById(id).subscribe(companyData => this.company = companyData);

    this.companiesService.getContacts(id).subscribe(contacts =>{
      console.log('id : ' + id)
      console.log('contact : ' + JSON.stringify(contacts))
      this.companyContacts = contacts;
    })
  }

}
