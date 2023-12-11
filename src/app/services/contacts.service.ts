import {HttpClient} from "@angular/common/http";
import {Contact} from "../models/contact.model";
import {Injectable} from "@angular/core";

@Injectable()
export class ContactsService{
  constructor(private http:HttpClient) {
  }

  fetchContacts(){
    return this.http.get<Contact[]>("../assets/fakeData/contacts.json")
  }
}
