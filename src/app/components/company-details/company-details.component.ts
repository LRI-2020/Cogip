import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent {
  company: Company | undefined;
  constructor(private route:ActivatedRoute, private companiesService:CompaniesService) {
    let id = +this.route.snapshot.params['id'];
    this.companiesService.getCompanytById(id).subscribe(companyData => this.company = companyData);

  }

}
