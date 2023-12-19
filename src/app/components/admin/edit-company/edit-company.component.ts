import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../../services/navigation.service";
import {Company, CompanyType} from "../../../models/company.model";
import {countriesData} from "../../../shared/countriesData";

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.scss'
})
export class EditCompanyComponent implements OnInit {
  isLoading=true;
  protected readonly CompanyType = CompanyType;
  editMode=false;

  originalCompany:Company|undefined;
  companyForm = new FormGroup({
    "company_id": new FormControl(''),
    "company_name": new FormControl('', Validators.required),
    "company_type": new FormControl({}),
    "company_country": new FormControl({}),
    "vta_number": new FormControl({})
  });

  constructor(private navigationService:NavigationService) {
  }

  onSave() {

  }

  onCancel() {

  }

  onBack() {
    this.navigationService.back("/admin");
  }

  protected readonly countriesData = countriesData;

  ngOnInit(): void {

    this.isLoading=false;
  }

}
