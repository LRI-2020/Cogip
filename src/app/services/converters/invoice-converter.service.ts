import { Injectable } from '@angular/core';
import {Invoice, RawInvoice} from "../../models/invoice.model";
import {RawCompanyModel} from "../../models/company.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceConverterService {

  constructor() { }

  isRawInvoice(value:any):value is RawInvoice {

  if (!value || typeof value !== 'object') {
  return false
}
const object = value as Record<string, unknown>

return typeof object['id'] === 'string' &&
  typeof object['invoice_number'] === 'string' &&
  typeof object['due_date'] === 'string' &&
  typeof object['creationDate'] === 'string' &&
  typeof object['company_id'] === 'string'

}

rawToInvoice(rawInvoice:RawInvoice){
  let creationDate = !isNaN(Date.parse(rawInvoice.creationDate))?new Date(rawInvoice.creationDate): new Date('1970-01-01');
  let dueDate = !isNaN(Date.parse(rawInvoice.due_date))?new Date(rawInvoice.due_date): new Date('1970-01-01');

  return new Invoice(rawInvoice.id, rawInvoice.invoice_number, dueDate, rawInvoice.company_id, creationDate)
  }
}
