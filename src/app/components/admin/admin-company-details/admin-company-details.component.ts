import {Component, OnDestroy, OnInit} from '@angular/core';
import {Company} from "../../../models/company.model";
import {Contact} from "../../../models/contact.model";
import {mergeMap, of, Subscription, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {CompaniesService} from "../../../services/companies.service";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-admin-company-details',
  templateUrl: './admin-company-details.component.html',
  styleUrl: './admin-company-details.component.scss'
})
export class AdminCompanyDetailsComponent implements OnInit, OnDestroy {
  companyContacts: Contact[] = []
  companyId: string = '';
  isLoadingContacts = true;
  subscriptionsList: Subscription[] = [];
  contactsError = false;

  constructor(private route: ActivatedRoute, private companiesService: CompaniesService, private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.loadCompanyContacts();
  }

  loadData() {
    //listen id in url
    return this.route.params.pipe(
      mergeMap(params => {
        this.isLoadingContacts = true;
           //get observables with contact after getting company id
        return this.companiesService.getContacts(params['id']);
      }));
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  private loadCompanyContacts() {

    this.subscriptionsList.push(this.loadData().subscribe({
      next: (contacts) => {
        this.companyContacts = contacts;
        this.contactsError = false;
        this.isLoadingContacts = false;
      },
      error: () => {
        this.notificationsService.error('Oh Oh 😕', "The contacts details could not be loaded");
        this.contactsError = true;
        this.isLoadingContacts = false;
      }
    }));
  }
}
