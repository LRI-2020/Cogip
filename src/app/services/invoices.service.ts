import {HttpClient} from "@angular/common/http";
import {Invoice, RawInvoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";
import {map, mergeAll, mergeMap, toArray} from "rxjs";
import {CompaniesService} from "./companies.service";
import {dateToCorrectFormat} from "../shared/helpers";
import {InvoiceConverterService} from "./converters/invoice-converter.service";
import {API_KEY} from "../../../secret";

@Injectable()
export class InvoicesService {
  apiUrl = 'https://securd-dev-agent.frendsapp.com/api/accounting/v1/';

  constructor(private http: HttpClient, private companiesService: CompaniesService, private invoiceConverter: InvoiceConverterService) {
  }

  getInvoicesWithCompany(){
    return this.fetchInvoices().pipe(
      mergeAll(),
      mergeMap(
        invoice => {
          return this.companiesService.getCompanytById(invoice.company_id).pipe(map(company => {
              invoice.company_name = company?company.name:invoice.company_name;
              return invoice;
            }
          ))
        }),
      toArray())
  }

  private fetchInvoices() {

    return this.http.get<any[]>(this.apiUrl + 'invoice',{headers:{
        "X-API-Key": API_KEY
      }}).pipe(map(responseData => {
      let invoices: Invoice[] = [];
      responseData.forEach((d: any) => {
        if (this.invoiceConverter.isRawInvoice(d)) {
          let invoice = this.invoiceConverter.rawToInvoice(d as RawInvoice);
          invoices.push(invoice);
        }
      })
      return invoices;
    }));
  }

  fetchInvoiceById(id: string) {
    return this.http.get(this.apiUrl + 'invoice/' + id,{headers:{
        "X-API-Key": API_KEY
      }})
      .pipe(map(responseData => {
        if(this.invoiceConverter.isRawInvoice(responseData)){
          return this.invoiceConverter.rawToInvoice(responseData)
        }
        return undefined;
       }));
  }

  getInvoiceWithCompany(id:string)
  {
    return this.fetchInvoiceById(id).pipe(map(invoice => {
        if(invoice)
          return invoice
        throw new Error('no invoice found with this id')
      }),
      mergeMap(
        invoice => {
          return this.companiesService.getCompanytById(invoice.company_id).pipe(map(company => {
            invoice.company_name = company ? company.name : invoice.company_name;
            return invoice
          }))
        }
      ))
  }

  updateInvoice(invoice: Invoice) {
    let body = {
      "id": invoice.id,
      "ref": invoice.invoiceNumber,
      "date_due": invoice.dueDate,
      "invoice_creation": invoice.createdAt,
      "company_name": invoice.company_id
    }
    return this.http.put(this.apiUrl + 'update-invoice/' + invoice.id, body, {
      observe: 'response'
    })
  }

  createInvoice(invoiceNumber: string, companyName: string, dueDate: Date) {

    let body = {
      "ref": invoiceNumber,
      "date_due": dateToCorrectFormat(dueDate),
      "company_name": companyName
    };

    if (this.companyExist(companyName)) {
      return this.http.post(this.apiUrl + 'add-invoice', body, {observe: "response"});
    } else {
      throw new Error('this company does not exist')
    }


  }

  deleteInvoice(id: string) {

    if (this.fetchInvoiceById(id)) {
      return this.http.delete(this.apiUrl + 'del-invoice/' + id, {observe: "response"});
    } else {
      throw new Error('no invoice found with id ' + id);
    }
  }

  private companyExist(companyName: string) {
    return this.companiesService.getCompanyByName(companyName).subscribe(c => c) !== undefined;
  }
}

