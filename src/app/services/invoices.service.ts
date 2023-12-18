import {HttpClient} from "@angular/common/http";
import {Invoice, InvoiceConverter, RawInvoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";
import {map} from "rxjs";
import {Contact, ContactConverter, RawContact} from "../models/contact.model";
import {CompaniesService} from "./companies.service";
import {dateToCorrectFormat} from "../shared/helpers";

@Injectable()
export class InvoicesService{
  apiUrl = 'https://api-cogip-329f9c72c66d.herokuapp.com/api/';

  constructor(private http:HttpClient, private companiesService:CompaniesService) {
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

  updateInvoice(invoice: Invoice) {
    let body={
      "id": invoice.id,
      "ref": invoice.invoiceNumber,
      "date_due": invoice.dueDate,
      "invoice_creation": invoice.createdAt,
      "company_name": invoice.company
    }
     this.http.put(this.apiUrl + 'update-invoice/' + invoice.id, body, {
       observe : 'response'
     }).subscribe(response => {
        console.log(response)
     },
       error => {
         error.message;
       });
  }

  createInvoice(invoiceNumber: string, companyName: string, dueDate: Date) {

    let body={
      "ref": invoiceNumber,
      "date_due": dateToCorrectFormat(dueDate),
      "company_name": companyName
    };

    if(this.companyExist(companyName)){
      console.log('post request   '+JSON.stringify(body));
      return this.http.post(this.apiUrl+'add-invoice',body);
    }
    else{
      throw new Error('this company does not exist')
    }


  }

  private companyExist(companyName:string) {
    return this.companiesService.getCompanyByName(companyName).subscribe(c => c) !== undefined;
  }
}
