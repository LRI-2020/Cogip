import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contact} from "../../../models/contact.model";
import {forkJoin, mergeMap, of, Subscription, tap} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ContactsService} from "../../../services/contacts.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CompaniesService} from "../../../services/companies.service";
import {DatePipe} from "@angular/common";
import {NavigationService} from "../../../services/navigation.service";
import {NotificationsService} from "../../../services/notifications.service";

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
              private navigationService: NavigationService,
              private router: Router,
              private notificationsService: NotificationsService) {
  }

  onCancel() {
    this.displayData();
  }

  onBack() {
    this.navigationService.back("/admin");
  }

  onDelete(id:string) {
    if(id===this.originalContact?.id){
      this.subscriptionsList.push(this.contactsService.deleteContact(id).subscribe({
        next: () => {
          this.notificationsService.success('Success', "The contact has been deleted");
          this.router.navigate(['/admin/contacts'])
        },
        error:()=>{
          this.notificationsService.error('Oh Oh 😕', "The contact could not be deleted");
        }
      }))
    }
  }

  onSave() {
    if (!this.contactForm.valid) {
      this.contactForm.markAllAsTouched()
    } else {
      this.processForm();
    }
  }

  loadData() {
    return this.listenParams().pipe(
      mergeMap(params => {
        return forkJoin({params: of(params), companies: this.loadCompanies()});
      }),
      mergeMap(res => {
        return this.fulfillForm(res.params);
      })
    )
  }

  private displayData() {
    this.subscriptionsList.push(this.loadData().subscribe({
      next: () => {
        this.inError = false;
        this.isLoading = false;
      },
      error:()=>{
        this.inError = true;
        this.isLoading = false;
        this.notificationsService.error('Oh Oh 😕', "The contact could not be loaded");
        this.router.navigate(['/admin/contacts'])
      }
    }))
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

    this.displayData()
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

  private processForm() {
    if (!this.editMode) {
      this.createContact();
    } else {
      if (this.validForUpdate() && this.originalContact) {
        this.updateContact(this.originalContact)
      }
    }
  }

  private createContact() {
    this.contactsService.createContact(
      this.contactForm.get('contact_name')?.value,
      this.contactForm.get('contact_phone')?.value,
      this.contactForm.get('contact_email')?.value,
      this.contactForm.get('contact_company')?.value,
    ).subscribe({
      next: () => {
        this.notificationsService.success('Success', "The contact has been created");
        this.router.navigate(['/admin/contacts']);
      },
      error: (e) => {
        let error = e instanceof Error ? e.message + '.' : '';
        this.notificationsService.error('Oh Oh 😕', error + "The contact has not been created");
        this.loadData();
      }
    })
  }

  private validForUpdate() {
    let id = this.activatedRoute.snapshot.params['id'];
    return this.originalContact && this.originalContact.id === id && this.contactHasChanged();
  }

  private updateContact(originalContact: Contact) {
    let contactToUpdate = this.getUpdatedValues(originalContact);

    this.subscriptionsList.push(this.contactsService.updateContact(contactToUpdate).pipe(
      tap(() => {
        return this.loadData();
      })).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationsService.success('Success', "The contact has been updated");
      },
      error: () => {
        this.isLoading = false;
        this.notificationsService.error('Oh Oh 😕', "The contact has not been updated");
      }
    }));
  }

  private contactHasChanged() {
    return (
        this.originalContact?.name !== this.contactForm.get('contact_name')?.value)
      || (this.originalContact?.company !== this.contactForm.get('contact_company')?.value)
      || (this.originalContact?.phone !== this.contactForm.get('contact_phone')?.value)
      || (this.originalContact?.email !== this.contactForm.get('contact_email')?.value)
  }

  private getUpdatedValues(contact: Contact) {
    contact.name = this.contactForm.get('contact_name')?.value
    contact.company = this.contactForm.get('contact_company')?.value
    contact.phone = this.contactForm.get('contact_phone')?.value
    contact.email = this.contactForm.get('contact_email')?.value
    return contact;
  }
}
