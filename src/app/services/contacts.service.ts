import {HttpClient} from "@angular/common/http";
import {Contact, ContactConverter, RawContact} from "../models/contact.model";
import {Injectable} from "@angular/core";
import {map} from "rxjs";

@Injectable()
export class ContactsService {

  apiUrl = 'https://api-cogip-329f9c72c66d.herokuapp.com/api/';

  constructor(private http: HttpClient) {
  }

  fetchContacts() {

    return this.http.get<any>(this.apiUrl + 'contacts').pipe(map(responseData => {
      let contacts: Contact[] = [];
      if (responseData.data) {
        responseData.data.forEach((d: any) => {
          let contact = ContactConverter.toContact(d as RawContact);
          if (contact) {
            contacts.push(contact);
          }
        })
      }
      return contacts;
    }));
  }


  getContactById(id: number) {
    return this.http.get<any>(this.apiUrl + 'contacts/' + id.toString()).pipe(map(responseData => {
      if (responseData.data && responseData.data[0]) {
        return ContactConverter.toContact(responseData.data[0] as RawContact);
      }
        throw new Error('no contact found with id ' + id);
    }));
    // return this.fetchContacts().pipe(map(contactsData => contactsData.find(c => c.id === id)))
  }
}
