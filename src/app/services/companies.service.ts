import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Company, CompanyConverter,CompanyRawModel} from "../models/company.model";
import {map} from "rxjs";
import {ContactsService} from "./contacts.service";
import {sortByAsc} from "../shared/helpers";


@Injectable()
export class CompaniesService {

  apiUrl='https://api-cogip-329f9c72c66d.herokuapp.com/api/';
  constructor(private http: HttpClient, private contactsService: ContactsService) {
  }

  fetchCompanies() {

    return this.http.get<any>( this.apiUrl+'companies').pipe(map(responseData => {
      let companies:Company[] = [];
      if (responseData.data) {
        responseData.data.forEach((d: any) => {
          let company = CompanyConverter.rawToCompany(d as CompanyRawModel);
          if (company) {
            companies.push(company);
          }
        })
      }
      return companies;
    }));
  }

  getCompanytById(id: number) {

    return this.http.get<any>(this.apiUrl + 'companies/' + id.toString()).pipe(map(responseData => {
      if (responseData.data) {
        return CompanyConverter.rawToCompany(responseData.data as CompanyRawModel);
      }
      throw new Error('no company found with id ' + id);

    }));
  }

  getCompanyByName(name:string){
    return this.fetchCompanies().pipe(map(companies => {
      return companies.find(c => c.name === name);
    }))
  }

  getContacts(companyId: number) {
    let companyName = '';
    this.getCompanytById(companyId).subscribe(companyData => {
      if (companyData != undefined)
        companyName = companyData.name
    });
    return this.contactsService.fetchContacts().pipe(map(contactsData => {
      let companyContact = contactsData.filter(c => c.company === companyName);
      return companyContact.sort(sortByAsc('id')).slice(0,2);
    }))
  }
}
