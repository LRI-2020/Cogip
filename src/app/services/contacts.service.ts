import {HttpClient} from "@angular/common/http";
import {Contact} from "../models/contact.model";
import {Injectable} from "@angular/core";
import {map} from "rxjs";

@Injectable()
export class ContactsService{
  constructor(private http:HttpClient) {
  }

  fetchContacts(){
    return this.http.get<Contact[]>("../assets/fakeData/contacts.json")
  }

  getContactById(id:number){
    return this.fetchContacts().pipe(map(contactsData => contactsData.find(c => c.id === id)))
  }
}
