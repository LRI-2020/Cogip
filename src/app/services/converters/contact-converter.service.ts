import { Injectable } from '@angular/core';
import {Contact, RawContact} from "../../models/contact.model";

@Injectable({
  providedIn: 'root'
})
export class ContactConverterService {

  isRawContact(value:any){
    if (!value || typeof value !== 'object') {
      return false
    }
    const object = value as Record<string, unknown>

    return typeof object['id'] === 'string' &&
      typeof object['name'] === 'string' &&
      typeof object['email'] === 'string' &&
      typeof object['phone'] === 'string' &&
      typeof object['company_id'] === 'string' &&
      typeof object['creationDate'] === 'string'
  }

  rawToContact(rawContact:RawContact){
    let creationDate = !isNaN(Date.parse(rawContact.creationDate))?new Date(rawContact.creationDate): new Date('1970-01-01');

    return new Contact(rawContact.id,rawContact.name,
      rawContact.phone, rawContact.email,
      rawContact.company_id,
      creationDate);
  }
}
