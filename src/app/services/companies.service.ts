import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Company, CompanyType} from "../models/company.model";
import {map, mergeMap} from "rxjs";
import {ContactsService} from "./contacts.service";
import {sortByAsc} from "../shared/helpers";
import {CompanyConverterService} from "./converters/company-converter.service";
import {API_KEY} from "../../../secret";


@Injectable()
export class CompaniesService {

  apiUrl = 'https://securd-dev-agent.frendsapp.com/api/accounting/v1/';

  constructor(private http: HttpClient, private contactsService: ContactsService, private companyConverter: CompanyConverterService) {
  }

  fetchCompanies() {
    return this.http.get<any[]>(this.apiUrl + 'company', {
      headers: {
        "X-API-Key": API_KEY
      }
    }).pipe(map(responseData => {
      return this.responseToCompanies(responseData);
    }));
  }

  getCompanytById(id: string) {

    return this.http.get<any>(this.apiUrl + 'company/' + id, {
      headers: {
        "X-API-Key": API_KEY
      }
    }).pipe(map(responseData => {
      return this.responseToCompany(responseData);
    }));
  }
  getContacts(companyId: string) {
    return this.getCompanytById(companyId).pipe(map(company => {
      if(company){
        return company;
      }
      throw new Error('no company for this id');
    }),mergeMap(() =>{
      return this.contactsService.fetchContacts().pipe(map(contacts=>{
        return contacts.filter(c => c.company === companyId).sort(sortByAsc('id')).slice(0, 2);
      }))
    }))
  }

  private responseToCompanies(responseData: any[]) {
    let companies: Company[] = []
    responseData.forEach((d: any) => {
      if (this.companyConverter.isRawCompany(d)) {
        let company = this.companyConverter.rawToCompany(d);
        if (company) {
          companies.push(company);
        }
      }
    })
    return companies;
  }

  private responseToCompany(responseData: any): Company | undefined {

    if (this.companyConverter.isRawCompany(responseData)) {
      return this.companyConverter.rawToCompany(responseData);
    }
    throw new Error('No company');
  }

  updateCompany(company: Company) {
    let body = {
      id: company.id,
      company_name: company.name,
      type_name: CompanyType[company.type],
      country: company.country,
      tva: company.tva
    }

    return this.http.put(this.apiUrl + 'company', JSON.stringify(body), {
      observe: "response", headers: {
        "X-API-Key": API_KEY
      }
    })
  }

  createCompany(name: string, type: string, country: string, tva?: string) {
    let body = {
      company_name: name,
      type_name: type,
      country: country,
      tva: tva
    }
    return this.http.post(this.apiUrl + 'company', JSON.stringify(body), {
      observe: "response", headers: {
        "X-API-Key": API_KEY
      }
    })
  }

  deleteCompany(id: string) {
    if (this.getCompanytById(id)) {
      return this.http.delete(this.apiUrl + 'company/' + id, {
        observe: "response",
        headers: {
          "X-API-Key": API_KEY
        }
      })
    }
    throw new Error('no company with this id');
  }
}
