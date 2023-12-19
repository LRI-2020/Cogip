import { Injectable } from '@angular/core';
import {Company, CompanyRawModel, CompanyType} from "../../models/company.model";

@Injectable({
  providedIn: 'root'
})
export class CompanyConverterService {

  constructor() {
  }

  rawToCompany(rawCompany: CompanyRawModel):Company|undefined {
    if(this.isCompany(rawCompany)){
      return new Company(rawCompany.id,
        rawCompany.company_name,
        rawCompany.tva,
        rawCompany.country,
        rawCompany.type_name === 'client' ? CompanyType.client : CompanyType.supplier,
        new Date(rawCompany.creationDate))
    }
    return undefined;

  }

  isRawCompany(value: unknown): value is CompanyRawModel {

    if (!value || typeof value !== 'object') {
      return false
    }
    const object = value as Record<string, unknown>

    return typeof object['id'] === 'string' &&
      typeof object['company_name'] === 'string' &&
      typeof object['type_name'] === 'string' &&
      typeof object['country'] === 'string' &&
      typeof object['tva'] === 'string' &&
      typeof object['creationDate'] === 'string'

  }

  isCompany(rawCompany: CompanyRawModel) {

    let expectedValues = [
      {propName: "type_name", acceptedValues: ["client", 'supplier']}    ]

    return !isNaN(Date.parse(rawCompany.creationDate)) && this.hasExpectedValues(rawCompany as Record<string, any>,expectedValues)
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

