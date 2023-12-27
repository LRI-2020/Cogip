import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../../models/contact.model";
import {catchError, forkJoin, mergeMap, of, Subscription, tap, toArray} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ContactsService} from "../../../services/contacts.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CompaniesService} from "../../../services/companies.service";
import {DatePipe} from "@angular/common";
import {NavigationService} from "../../../services/navigation.service";

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent implements OnInit, OnDestroy {
  originalContact: Contact | undefined;
  editMode = false;
  isLoading = true;
  subscriptionsList: Subscription[] = [];
  companiesNames: { company_id: string, company_name: string }[] = []
  inError: boolean = false;


  contactForm: FormGroup = new FormGroup({
    "id": new FormControl(''),
    "contact_name": new FormControl('', Validators.required),
    "contact_phone": new FormControl('', Validators.required),
    "contact_email": new FormControl('', Validators.required),
    "contact_company": new FormControl('', Validators.required),
    "contact_created_at": new FormControl('')
  })

  constructor(private contactsService: ContactsService,
              private companiesService: CompaniesService,
              private activatedRoute: ActivatedRoute,
              private datePipe: DatePipe,
              private navigationService:NavigationService,
              private router: Router) {
  }

  onCancel() {
    this.loadData();
  }

  onBack() {
    this.navigationService.back("/admin");
  }

  onDelete() {

  }

  onSave() {

  }

  loadData() {
    this.listenParams().pipe(
      mergeMap(params=>{
        return forkJoin({params:of(params),companies:this.loadCompanies()});
      }),
      mergeMap(res => {
         return this.fulfillForm(res.params);
      })
     ).subscribe({
      next: () => {
        this.inError = false;
        this.isLoading = false;
      }
    })
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

    this.loadData()
  }

  private loadContact(id: string) {

    return this.contactsService.getContactById(id).pipe(
      tap(contact => {
        this.originalContact = contact;
        this.setForm(contact);
      })
    )
  }


  private setForm(c?: Contact) {
    this.contactForm.setValue({
      "id": c ? c.id : '',
      "contact_name": c ? c.name : '',
      "contact_phone": c ? c.phone : '',
      "contact_email": c ? c.email : '',
      "contact_company": c ? c.company : '',
      "contact_created_at": c ? this.datePipe.transform(c.createdAt, 'yyyy-MM-dd') : ''
    })
  }
  private listenParams() {
    return this.activatedRoute.params.pipe(
      mergeMap(params => {
        this.isLoading = true;
        this.editMode = params['id'] != null;
        return of(params);
      }))
  }


  private fulfillForm(params: Params) {
    if (this.editMode) {
      return this.loadContact(params['id'])
    } else {
      this.setForm()
      return of(true)
    }
  }

  private loadCompanies() {
    this.companiesNames = [];
    return this.companiesService.fetchCompanies().pipe(
      tap(companies => {
        companies.forEach(c => this.companiesNames.push({company_id: c.id, company_name: c.name}));
      }));
  }
}
