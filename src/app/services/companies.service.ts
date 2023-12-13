import {HttpClient} from "@angular/common/http";
import {Invoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";
import {Company} from "../models/company.model";
import {map} from "rxjs";
import {ContactsService} from "./contacts.service";
import {sortByAsc} from "../shared/helpers";

@Injectable()
export class CompaniesService {

  constructor(private http: HttpClient, private contactsService: ContactsService) {
  }

  fetchCompanies() {
    return this.http.get<Company[]>("../assets/fakeData/companies.json")
  }

  getCompanytById(id: number) {
    return this.fetchCompanies().pipe(map(companiesData => companiesData.find(c => c.id === id)));
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
