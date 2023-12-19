import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Contact} from "../../models/contact.model";
import {Subscription} from "rxjs";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  company: Company | undefined;
  companyContacts: Contact[] = []
  isLoadingCompany = true;
  errorCompany=false;
  isLoadingContacts = true;
  errorContacts=false;
  subscriptionsList: Subscription[] = []

  constructor(private route: ActivatedRoute, private companiesService: CompaniesService, private notificationsService:NotificationsService) {

  }

  ngOnInit(): void {
    this.loadData(this.route.snapshot.params['id']);
    this.listenUrlParams();
  }

  loadData(companyId: string) {
    this.loadCompany(companyId);
    this.loadCompanyContacts(companyId);
  }

  private loadCompany(companyId: string) {
    this.isLoadingCompany = true;
    this.errorCompany=false;

    this.subscriptionsList.push(this.companiesService.getCompanytById(companyId).subscribe({
      next:(companyData)=>{
        this.company = companyData;
        if(!companyData){
          this.errorCompany=true;
        }
        this.isLoadingCompany = false;
      },
      error:()=>{
        this.notificationsService.error('Oh Oh 😕', "The company details could not be loaded");
        this.errorCompany=true;
        this.isLoadingCompany = false;
      }
    }));

  }

  private loadCompanyContacts(companyId: string) {
    this.isLoadingContacts = true;
    this.errorContacts=false;
    this.subscriptionsList.push(this.companiesService.getContacts(companyId).subscribe({
      next : contacts => {
        this.companyContacts = contacts;
        this.isLoadingContacts = false;
        this.errorContacts=false;
      },

      error : () => {
        this.notificationsService.error('Oh Oh 😕', "The contact details could not be loaded");
        this.errorContacts=true;
        this.isLoadingContacts = false;

      }}));
  }
  private listenUrlParams() {
    this.subscriptionsList.push(this.route.params.subscribe((params) => {
      this.loadData(params['id']);
    }))
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }
}
