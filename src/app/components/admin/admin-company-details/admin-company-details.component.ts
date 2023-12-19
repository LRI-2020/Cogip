import {Component, OnDestroy, OnInit} from '@angular/core';
import {Company} from "../../../models/company.model";
import {Contact} from "../../../models/contact.model";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CompaniesService} from "../../../services/companies.service";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-admin-company-details',
  templateUrl: './admin-company-details.component.html',
  styleUrl: './admin-company-details.component.scss'
})
export class AdminCompanyDetailsComponent implements OnInit, OnDestroy {
  company: Company | undefined;
  companyContacts: Contact[] = []
  isLoadingCompanyDetails = true;
  isLoadingContacts = true;
  subscriptionsList: Subscription[] = [];
  contactsError = false;
  companyError = false;

  constructor(private route: ActivatedRoute, private companiesService: CompaniesService, private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.subscriptionsList.push(this.route.params.subscribe((params) => {
      this.loadData(params['id']);
    }))
  }

  loadData(id: string) {
    this.loadCompany(id);
    this.loadCompanyContacts(id);
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  private loadCompany(companyId: string) {
    this.isLoadingCompanyDetails = true;
    this.companyError = false;

    this.subscriptionsList.push(this.companiesService.getCompanytById(companyId).subscribe({
      next: (companyData) => {
        if(!companyData){
          this.companyError = true;
          this.notificationsService.error('Oh Oh 😕', "The company details could not be loaded");
        }
        else{
          this.company = companyData;
        }
        this.isLoadingCompanyDetails = false;
      },
      error: () => {
        this.companyError = true;
        this.notificationsService.error('Oh Oh 😕', "The company details could not be loaded");
        this.isLoadingCompanyDetails = false;
      }
    }));
  }

  private loadCompanyContacts(companyId: string) {
    this.isLoadingCompanyDetails = true;
    this.isLoadingContacts = true;

       this.subscriptionsList.push(this.companiesService.getContacts(companyId).subscribe({
      next: (contacts) => {
        this.contactsError = false;
        this.companyContacts = contacts;
        this.isLoadingContacts = false;
      },
      error: () => {
        this.contactsError = true;
        this.notificationsService.error('Oh Oh 😕',"The contacts details could not be loaded");
        this.isLoadingContacts = false;
      }
    }));
  }
}
