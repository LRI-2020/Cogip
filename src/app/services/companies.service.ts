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

    return this.http.get<{ message:string,'content-type':string,status:string,code:number,data:any[]}>( this.apiUrl+'companies').pipe(map(companiesResponse => {
      let companies:Company[]=[];
      let converter:CompanyConverter = new CompanyConverter();
      companiesResponse.data.forEach(d => {
        companies.push(converter.rawToCompany(d as CompanyRawModel));
      })
      console.log(JSON.stringify(companies));
      return companies;
    }));
  }

  getCompanytById(id: number) {

    return this.http.get<{ message:string,'content-type':string,status:string,code:number,data:CompanyRawModel}>(this.apiUrl+'companies/'+id.toString()).pipe(map(companyResponse => {
      let converter:CompanyConverter = new CompanyConverter();
      return converter.rawToCompany(companyResponse.data);
    }));
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
