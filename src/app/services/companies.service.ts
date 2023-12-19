import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Company, RawCompanyModel} from "../models/company.model";
import {map} from "rxjs";
import {ContactsService} from "./contacts.service";
import {sortByAsc} from "../shared/helpers";
import {CompanyConverterService} from "./converters/company-converter.service";
import {API_KEY} from "../../../secret";


@Injectable()
export class CompaniesService {

  // apiUrl='https://api-cogip-329f9c72c66d.herokuapp.com/api/';
  apiUrl='https://securd-dev-agent.frendsapp.com/api/accounting/v1/';
  constructor(private http: HttpClient, private contactsService: ContactsService, private companyConverter:CompanyConverterService) {
  }

  fetchCompanies() {
    console.log(' api key : ' + API_KEY)
    return this.http.get<any[]>( this.apiUrl+'company', {headers:{
        "X-API-Key": API_KEY
      }}).pipe(map(responseData => {
      return this.responseToCompanies(responseData);
    }));
  }

  getCompanytById(id: string) {

    return this.http.get<any>(this.apiUrl + 'company/' + id,{headers:{
        "X-API-Key": API_KEY     }}).pipe(map(responseData => {
      let company = this.responseToCompany(responseData)
        if(company)
          return company;
      return undefined
    }));
  }

  getCompanyByName(name:string){
    return this.fetchCompanies().pipe(map(companies => {
      return companies.find(c => c.name === name);
    }))
  }

  getContacts(companyId: string) {
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

  private responseToCompanies(responseData:any[]) {
    let companies:Company[]=[]
    responseData.forEach((d: any) => {
      if(this.companyConverter.isRawCompany(d)){
        let company = this.companyConverter.rawToCompany(d as RawCompanyModel);
        if (company) {
          companies.push(company);
        }
      }
    })
    return companies;
  }

  private responseToCompany(responseData:any):Company|undefined {

      if(this.companyConverter.isRawCompany(responseData)){
        console.log('response is a rawCompany : ' + JSON.stringify(responseData as RawCompanyModel))
        return this.companyConverter.rawToCompany(responseData as RawCompanyModel);
        }
      console.log('response not a rawCompany')
      return undefined;

  }
}
