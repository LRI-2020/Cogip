import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Company} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Contact} from "../../models/contact.model";
import {Subscriber, Subscription} from "rxjs";
import {NotificationType} from "../../models/notification.model";
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
    let id = +this.route.snapshot.params['id'];
    this.loadData(id);

    this.subscriptionsList.push(this.route.params.subscribe((params) => {
      let id = +params['id'];
      this.loadData(id);
    }))
  }

  loadData(id: number) {
    this.isLoadingCompany = true;
    this.isLoadingContacts = true;

    this.subscriptionsList.push(this.companiesService.getCompanytById(id).subscribe({
      next:(companyData)=>{
        this.errorCompany=false;
        this.company = companyData;
        this.isLoadingCompany = false;
      },
      error:(error)=>{
        this.notificationsService.notify({
          title: 'Oh Oh 😕',
          type: NotificationType.error,
          message: "The company details could not be loaded",
        });
        this.errorCompany=true;
        this.isLoadingCompany = false;
      }
    }));

    this.subscriptionsList.push(this.companiesService.getContacts(id).subscribe({
      next : contacts => {
        this.companyContacts = contacts;
        this.isLoadingContacts = false;
        this.errorContacts=false;
      },

      error : error => {
        this.notificationsService.notify({
          title: 'Oh Oh 😕',
          type: NotificationType.error,
          message: "The contacts details could not be loaded",
        });
        this.errorContacts=true;
        this.isLoadingContacts = false;

      }}));
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

}
