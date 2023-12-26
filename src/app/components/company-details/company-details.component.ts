import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Company, CompanyType} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Contact} from "../../models/contact.model";
import {catchError, concatMap, mergeMap, of, Subscription, tap} from "rxjs";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  protected readonly CompanyType = CompanyType;
  company: Company | undefined;
  companyContacts: Contact[] = []
  isLoadingCompany = true;
  errorCompany = false;
  isLoadingContacts = true;
  errorContacts = false;
  subscriptionsList: Subscription[] = []

  constructor(private route: ActivatedRoute,
              private router: Router,
              private companiesService: CompaniesService,
              private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadCompany() {
    return this.route.params.pipe(
      concatMap(params => {
        return this.companiesService.getCompanytById(params['id']).pipe(
          tap(company => {
              if (company instanceof Company) {
                this.company = company;
              }
            return of(company)
            }
          ))
      }),
      catchError(error => {
        this.errorCompany = true;
        this.errorContacts = true;
        this.notificationsService.error('Oh Oh 😕', "The company could not be loaded");
        this.router.navigate(['/companies']);
        return of(true)
      })
    )
  }

  loadContacts(companyId: string) {
    console.log('load Contacts')
    return this.companiesService.getContacts(companyId).pipe(
      tap(contacts => {
        this.companyContacts = contacts;
        return of(contacts);
      }),
      catchError(error => {
        this.errorContacts = true;
        this.notificationsService.error('Oh Oh 😕', "The company's contacts could not be loaded");
        return of(true);
      }));
  }

  loadData() {
    this.isLoadingCompany = true;
    this.isLoadingContacts = true;

    this.subscriptionsList.push(
      this.loadCompany().pipe(
        concatMap(company => {
          if(company instanceof Company)
              return this.loadContacts(company.id);
          return of(company);
        }))
        .subscribe({
          next: () => {
            this.isLoadingCompany = false;
            this.isLoadingContacts = false;
          },
          error: () => {
            console.log('company in error : ' + this.errorCompany)
            console.log('contacts in error : ' + this.errorContacts)
            this.isLoadingCompany = false;
            this.isLoadingContacts = false;
          }
        })
    )
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }
}
