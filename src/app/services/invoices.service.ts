import {HttpClient} from "@angular/common/http";
import {Invoice, InvoiceConverter, RawInvoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";
import {map} from "rxjs";
import {Contact, ContactConverter, RawContact} from "../models/contact.model";

@Injectable()
export class InvoicesService{
  apiUrl = 'https://api-cogip-329f9c72c66d.herokuapp.com/api/';

  constructor(private http:HttpClient) {
  }
  fetchInvoices(){

    return this.http.get<any>(this.apiUrl + 'invoices').pipe(map(responseData => {
      let invoices:Invoice[] = [];
      if (responseData.data) {
        responseData.data.forEach((d: any) => {
          let invoice = InvoiceConverter.toInvoice(d as RawInvoice);
          if (invoice) {
            invoices.push(invoice);
          }
        })
      }
      return invoices;
    }));  }

  getInvoiceBy(id: number) {
    return this.http.get<any>(this.apiUrl + 'invoices/' + id.toString()).pipe(map(responseData => {
      if (responseData.data && responseData.data[0]) {
        return InvoiceConverter.toInvoice(responseData.data[0] as RawInvoice);
      }
      throw new Error('no invoice found with id ' + id);

    }));  }
}
