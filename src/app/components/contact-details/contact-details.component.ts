import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactsService} from "../../services/contacts.service";
import {catchError, concatMap, of, Subscription, tap} from "rxjs";
import {NotificationsService} from "../../services/notifications.service";
import {CompaniesService} from "../../services/companies.service";

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent implements OnInit, OnDestroy {

  contact: Contact | undefined;
  isLoading = true;
  inError = false;
  subscriptionsList: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private contactsService: ContactsService,
              private companiesService: CompaniesService,
              private notificationsService: NotificationsService,
              private router:Router) {

  }

  ngOnInit(): void {

    this.loadData()

  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  loadContact(){
   return this.route.params.pipe(
      concatMap(params=>{
        this.isLoading = true;
        return this.contactsService.getContactById(params['id'])
          .pipe(
            tap(contactData => {
              this.contact = contactData;
              return of(contactData)
            }))
      }))
  }

  loadCompanyName(companyId:string){
    return this.companiesService.getCompanytById(companyId).pipe(
      tap(company=>{
        if(this.contact !== undefined){
          this.contact.company_name = company?company.name:'';
        }
      }),
      catchError(err=>{return of(true)})
    )
  }

  loadData() {

    this.subscriptionsList.push(this.loadContact().pipe(
      concatMap(contact=>{
        return this.loadCompanyName(contact.company)
      })
    ).subscribe({
      next: (d) => {
        this.isLoading = false;
        this.inError = false;
      },
      error: (d) => {
        this.notificationsService.error('Oh Oh 😕', "The contact details could not be loaded");
        this.inError = true;
        this.isLoading = false;
        this.router.navigate(['contacts'])
      }
    }));

  }


}
