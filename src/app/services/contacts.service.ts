import {HttpClient} from "@angular/common/http";
import {Contact, RawContact} from "../models/contact.model";
import {Injectable} from "@angular/core";
import {map} from "rxjs";
import {ContactConverterService} from "./converters/contact-converter.service";
import {API_KEY} from "../../../secret";

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

  updateContact(contact:Contact){
    let body={
      "id":contact.id,
      "name": contact.name,
      "email": contact.email,
      "phone": contact.phone,
      "company_id": contact.company
    }

    return this.http.put(this.apiUrl+'contact/',body,{
      headers: {
        "X-API-Key": API_KEY
      },
      observe:"response"
    })
  }
  createContact(name:string,phone:string,email:string,companyId:string){
    let body={
      "name": name,
      "email": email,
      "phone": phone,
      "company_id": companyId
    }

    return this.http.post(this.apiUrl+'contact/',body,{
      headers: {
        "X-API-Key": API_KEY
      },
      observe:"response"
    })
  }

  deleteContact(id:string){
    return this.http.delete(this.apiUrl+'contact/'+id,{
      headers: {
        "X-API-Key": API_KEY
      },
      observe:"response"
    })
  }
}
