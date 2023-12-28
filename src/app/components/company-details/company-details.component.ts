import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Company, CompanyType} from "../../models/company.model";
import {CompaniesService} from "../../services/companies.service";
import {Contact} from "../../models/contact.model";
import {catchError, concatMap, EMPTY, of, Subscription, tap} from "rxjs";
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
        this.setLoading();
        return this.companiesService.getCompanytById(params['id']).pipe(
          tap(company => {
              if (company instanceof Company) {
                this.company = company;
              }
            }
          ))
      }),
      catchError(error => {
        this.errorCompany = true;
        this.errorContacts = true;
        this.notificationsService.error('Oh Oh 😕', "The company could not be loaded");
        this.router.navigate(['/companies']);
        return EMPTY
      })
    )
  }

  loadContacts(companyId: string) {
    return this.companiesService.getContacts(companyId).pipe(
      tap(contacts => {
        this.companyContacts = contacts;
      }),
      catchError(error => {
        this.errorContacts = true;
        this.notificationsService.error('Oh Oh 😕', "The company's contacts could not be loaded");
        return of(error);
      }));
  }

  loadData() {
    this.subscriptionsList.push(
      this.loadCompany().pipe(
        concatMap(company => {
          if(company instanceof Company)
              return this.loadContacts(company.id);
          return of(company);
        }))
        .subscribe({
          next: () => {
            this.setLoaded();
          },
          error: () => {
            this.setLoaded();
          }
        })
    )
  }

  setLoading(){
    this.isLoadingCompany = true;
    this.isLoadingContacts = true;
  }

  setLoaded(){
    this.isLoadingCompany = false;
    this.isLoadingContacts = false;
  }
  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }
}
