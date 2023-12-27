import {HttpClient} from "@angular/common/http";
import {Contact, RawContact} from "../models/contact.model";
import {Injectable} from "@angular/core";
import {catchError, concatMap, map, of, tap} from "rxjs";
import {ContactConverterService} from "./converters/contact-converter.service";
import {API_KEY} from "../../../secret";
import {CompaniesService} from "./companies.service";

@Injectable()
export class ContactsService {

  apiUrl = 'https://securd-dev-agent.frendsapp.com/api/accounting/v1/';

  constructor(private http: HttpClient,
              private contactConverter: ContactConverterService) {
  }

  fetchContacts() {

    return this.http.get<any[]>(this.apiUrl + 'contact', {
      headers: {
        "X-API-Key": API_KEY
      }
    }).pipe(map(responseData => {
      let contacts: Contact[] = []
      responseData.forEach((d: any) => {
        if (this.contactConverter.isRawContact(d)) {
          contacts.push(this.contactConverter.rawToContact(d as RawContact));
        }
      })
      return contacts;
    }));
  }

  getContactById(id: string) {
    return this.http.get<any>(this.apiUrl + 'contact/' + id, {
      headers: {
        "X-API-Key": API_KEY
      }
    }).pipe(
      map(response => {
        if (this.contactConverter.isRawContact(response))
          return this.contactConverter.rawToContact(response as RawContact)

        throw new Error('contact not found')
      }))
  }
}
