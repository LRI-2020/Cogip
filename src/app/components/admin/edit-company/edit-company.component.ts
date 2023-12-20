import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {Company, CompanyType} from "../../../models/company.model";
import {countriesData, getCountryCode, getCountryName} from "../../../shared/countriesData";
import {Subscription} from "rxjs";
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
    this.subscriptionsList.push(this.companiesService.getCompanytById(id).subscribe({
      next: companyData => {
        if (companyData) {
          this.originalCompany = companyData;
          this.setFormValue(this.originalCompany);
          this.isLoading = false;
        } else {
          this.setErrorState("The company could not be loaded")
        }
      },
      error: () => {
        this.setErrorState("The company could not be loaded")
        this.router.navigate(['/admin/companys']);
      }
    }));
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
      this.fullFillForm(this.originalCompany.id);
    } else {
      this.setFormValue();
    }
  }

  onBack() {
    this.navigationService.back("/admin");
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
    let type = this.companyForm.get('company_name')?.value
    let country = this.companyForm.get('company_name')?.value
    let tva = this.companyForm.get('company_name')?.value
    try {
      this.companiesService.createcompany(name,type,country,tva).subscribe({
        next: (response) => {
          if (response.ok) {
            this.notificationsService.success('Success', "The company has been created");
            this.router.navigate(['/companys']);
          }
        },
        error: () => {
          this.notificationsService.error('Oh Oh 😕', "The company has not been created");
        }
      })
    } catch (e) {
      if (e instanceof Error)
        this.notificationsService.error('Oh Oh 😕', "The company has not been created : "+e.message);

      else
        this.notificationsService.error('Oh Oh 😕', "The company has not been created");
    }
  }

  private newValues() {

    return (this.originalCompany?.name !== this.companyForm.get('company_name')?.value)
      || (this.originalCompany?.tva !== this.companyForm.get('vta_number')?.value)
      || (this.originalCompany?.type !== +this.companyForm.get('company_type')?.value)
      || (getCountryCode(this.originalCompany? this.originalCompany.country : "") !== this.companyForm.get('company_country')?.value)
  }

  private loadData() {
    this.subscriptionsList.push(this.activeRoute.params.subscribe((params) => {
      this.editMode = params['id'] != null;
      if (this.editMode) {
        this.fullFillForm(params['id']);
      } else {
        this.isLoading = false;
      }
    }));
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
    if (this.originalCompany) {
      this.fullFillForm(this.originalCompany.id);
    } else {
      this.router.navigate(['/admin/companys']);
    }
  }
}
