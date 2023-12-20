import { Injectable } from '@angular/core';
import {Company, RawCompanyModel, CompanyType} from "../../models/company.model";

@Injectable({
  providedIn: 'root'
})
export class CompanyConverterService {

  constructor() {
  }

  rawToCompany(rawCompany: RawCompanyModel):Company {
    let creationDate = !isNaN(Date.parse(rawCompany.creationDate))?new Date(rawCompany.creationDate): new Date('1970-01-01');
    if(isNaN(Date.parse(rawCompany.creationDate))){

    }
      return new Company(rawCompany.id,
        rawCompany.company_name,
        rawCompany.tva?rawCompany.tva:"",
        rawCompany.country?rawCompany.country:"Belgium",
        rawCompany.type_name === 'client' ? CompanyType.Client : CompanyType.Supplier,
        creationDate)

  }

  isRawCompany(value: unknown): value is RawCompanyModel {

    if (!value || typeof value !== 'object') {
      return false
    }
    const object = value as Record<string, unknown>

    return typeof object['id'] === 'string' &&
      typeof object['company_name'] === 'string' &&
      typeof object['type_name'] === 'string' &&
      typeof object['creationDate'] === 'string'

  }

  isCompany(rawCompany: RawCompanyModel) {

    return !isNaN(Date.parse(rawCompany.creationDate))
  }

  private hasExpectedValues(object: Record<string, any>, expectedValues: { propName: string, acceptedValues: string[] }[]) {
    let result = true;
    expectedValues.forEach(ev => {
      let actualValue = object[ev.propName].toString().toLowerCase().trim();

      //search for actualValue in expected values for the related property
      if (ev.acceptedValues.indexOf(actualValue) === -1) {
        console.log(`Property ${ev.propName} has not an accepted value : ${actualValue}`)
        result = false;
      }
    })
    return result;
  }
}

