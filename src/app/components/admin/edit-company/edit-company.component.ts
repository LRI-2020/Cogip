import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {Company, CompanyType} from "../../../models/company.model";
import {countriesData, getCountryCode, getCountryName} from "../../../shared/countriesData";
import {catchError, mergeMap, of, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {CompaniesService} from "../../../services/companies.service";
import {NotificationsService} from "../../../services/notifications.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.scss'

})
export class EditCompanyComponent implements OnInit {
  protected readonly CompanyType = CompanyType;
  protected readonly countriesData = countriesData;
  editMode = false;
  isLoading = true;
  subscriptionsList: Subscription[] = [];
  companyError = false;

  originalCompany: Company | undefined;
  companyForm: FormGroup = new FormGroup({
    "company_id": new FormControl(''),
    "company_name": new FormControl('', Validators.required),
    "company_type": new FormControl('', Validators.required),
    "company_country": new FormControl('', Validators.required),
    "vta_number": new FormControl(''),
    "created_at": new FormControl('')
  });

  constructor(private navigationService: NavigationService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              private companiesService: CompaniesService,
              private datepipe: DatePipe) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadData();
  }

  private fullFillForm(id: string) {
    this.isLoading = true;
    return this.companiesService.getCompanytById(id).pipe(
      mergeMap(company => {
      if (company!==undefined) {
        this.originalCompany = company;
        this.setFormValue(this.originalCompany);
      } else {
        this.setErrorState("The company could not be loaded");
        this.router.navigate(['/admin/companies']);
      }
      this.isLoading = false;
      return of(company)
    }),
      catchError(()=> {
        this.isLoading = false;
        this.setErrorState("The company could not be loaded");
        this.router.navigate(['/admin/companies']);
        return of(true);
      }
    ))
  }

  onSave() {
    if (this.companyForm.valid) {
      if (this.editMode) {
        this.updateCompany()
      } else {
        this.createCompany()
      }
    } else {
      this.companyForm.markAllAsTouched();
    }
  }

  onCancel() {
    if (this.editMode && this.originalCompany) {
      this.subscriptionsList.push(this.fullFillForm(this.originalCompany.id).subscribe());
    } else {
      this.setFormValue();
    }
  }

  onBack() {
    this.navigationService.back("/admin");
  }

  onDelete() {
    let id = this.activeRoute.snapshot.params['id'];
    if (this.originalCompany?.id === id) {
      try {
        this.subscriptionsList.push(this.companiesService.deleteCompany(id).subscribe({
          next: () => {
            this.notificationsService.success('Success', "The company has been deleted");
            this.router.navigate(['/admin/companies'])
          },
          error: () => {
            this.notificationsService.error('Oh Oh 😕', "The company has not been deleted : ");
          }
        }))
      } catch (e) {
        let error = (e instanceof Error) ? e.message : 'An error occured.'
        this.notificationsService.error('Oh Oh 😕', error + "The company has not been deleted : ");
      }
    }


  }

  private setErrorState(message: string) {
    this.companyError = true;
    this.notificationsService.error('Oh Oh 😕', message);
  }

  private setFormValue(company?: Company) {
    let countryCode = company ? getCountryCode(company.country) : '';
    this.companyForm.setValue({
      'company_id': company ? company.id : '',
      'company_name': company ? company.name : '',
      'company_country': countryCode !== '' ? countryCode : 'BE',
      'company_type': company ? company.type.toString() : CompanyType.Client.toString(),
      'vta_number': company && company.tva ? company.tva : '',
      'created_at': company ? this.datepipe.transform(company.createdAt, 'yyyy-MM-dd') : ''
    })
  }

  private updateCompany() {

    let id = this.activeRoute.snapshot.params['id'];
    if (this.originalCompany && this.originalCompany.id === id && this.newValues()) {
      this.setNewCompanyValues();
      try {
        this.companiesService.updateCompany(this.originalCompany).subscribe({
          next: (response) => {
            if (response.ok && this.originalCompany) {
              this.resetUpdateForm();
              this.notificationsService.success('Success', "The company has been updated");
            }
          },
          error: () => {
            this.notificationsService.error('Oh Oh 😕', "The company has not been updated");
            this.resetUpdateForm();
          }
        })
      } catch (e) {
        if (e instanceof Error) {
          this.notificationsService.error('Oh Oh 😕', "The company has not been updated : " + e.message);
        }
      }
    }

  }

  private createCompany() {
    let name = this.companyForm.get('company_name')?.value
    let type = CompanyType[+this.companyForm.get('company_type')?.value]
    let country = getCountryName(this.companyForm.get('company_country')?.value)
    let tva = this.companyForm.get('vta_number')?.value
    try {
      this.companiesService.createCompany(name, type, country, tva).subscribe({
        next: (response) => {
          if (response.ok) {
            this.notificationsService.success('Success', "The company has been created");
            this.router.navigate(['/admin/companies']);
          }
        },
        error: () => {
          this.notificationsService.error('Oh Oh 😕', "The company has not been created");
        }
      })
    } catch (e) {
      if (e instanceof Error)
        this.notificationsService.error('Oh Oh 😕', "The company has not been created : " + e.message);

      else
        this.notificationsService.error('Oh Oh 😕', "The company has not been created");
    }
  }

  private newValues() {

    return (this.originalCompany?.name !== this.companyForm.get('company_name')?.value)
      || (this.originalCompany?.tva !== this.companyForm.get('vta_number')?.value)
      || (this.originalCompany?.type !== +this.companyForm.get('company_type')?.value)
      || (getCountryCode(this.originalCompany ? this.originalCompany.country : "") !== this.companyForm.get('company_country')?.value)
  }

  private loadData() {
    this.subscriptionsList.push(this.activeRoute.params.pipe(mergeMap(params =>{
      this.editMode = params['id'] != null;
      if (this.editMode) {
        return this.fullFillForm(params['id']);
      } else {
        this.isLoading = false;
        return of(true);
      }
    })).subscribe());
  }

  private setNewCompanyValues() {
    if (this.originalCompany) {
      this.originalCompany.name = this.companyForm.get('company_name')?.value;
      this.originalCompany.tva = this.companyForm.get('vta_number')?.value;
      this.originalCompany.country = getCountryName(this.companyForm.get('company_country')?.value);
      this.originalCompany.type = +this.companyForm.get('company_type')?.value;
    }

  }

  private resetUpdateForm() {
      this.subscriptionsList.push(this.fullFillForm(this.originalCompany?this.originalCompany.id:'-1').subscribe());
  }
}
