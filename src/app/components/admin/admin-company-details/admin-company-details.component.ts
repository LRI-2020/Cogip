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
    let id = +this.route.snapshot.params['id'];
    this.loadData(id);
    this.subscriptionsList.push(this.route.params.subscribe((params) => {
      let id = +params['id'];
      this.loadData(id);
    }))
  }

  loadData(id: number) {
    this.isLoadingCompanyDetails = true;
    this.isLoadingContacts = true;

    this.subscriptionsList.push(this.companiesService.getCompanytById(id).subscribe({
      next: (companyData) => {
        this.companyError = false;
        this.company = companyData;
        this.isLoadingCompanyDetails = false;
      },
      error: (error) => {
        this.companyError = true;
        this.notificationsService.error('Oh Oh 😕', "The company details could not be loaded");
        this.isLoadingCompanyDetails = false;
      }
    }));

    this.subscriptionsList.push(this.companiesService.getContacts(id).subscribe({
      next: (contacts) => {
        this.contactsError = false;
        this.companyContacts = contacts;
        this.isLoadingContacts = false;
      },
      error: (error) => {
        this.contactsError = true;
        this.notificationsService.error('Oh Oh 😕',"The contacts details could not be loaded");
        this.isLoadingContacts = false;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }
}
