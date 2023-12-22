import {HttpClient} from "@angular/common/http";
import {Invoice, RawInvoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";
import {catchError, empty, map, mergeAll, mergeMap, of, toArray} from "rxjs";
import {CompaniesService} from "./companies.service";
import {InvoiceConverterService} from "./converters/invoice-converter.service";
import {API_KEY} from "../../../secret";
import {DatePipe} from "@angular/common";
import {Company} from "../models/company.model";

@Injectable()
export class InvoicesService {
  apiUrl = 'https://securd-dev-agent.frendsapp.com/api/accounting/v1/';

  constructor(private http: HttpClient,
              private datePipe: DatePipe,
              private companiesService: CompaniesService,
              private invoiceConverter: InvoiceConverterService) {
  }

  getInvoicesWithCompany() {
    return this.fetchInvoices().pipe(
      mergeAll(),
      mergeMap(
        invoice => {
          return this.companiesService.getCompanytById(invoice.company_id).pipe(
            //When company has been deleted but not invoice - catch error && continue
            catchError(error=>{console.log(error); return of(true)}),
            map(company => {
            invoice.company_name = company && company instanceof Company? company.name : invoice.company_name;
              return invoice;
            }
          ))
        }),
      toArray())
  }

  private fetchInvoices() {

    return this.http.get<any[]>(this.apiUrl + 'invoice', {
      headers: {
        "X-API-Key": API_KEY
      }
    }).pipe(map(responseData => {
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
    return this.http.get(this.apiUrl + 'invoice/' + id, {
      headers: {
        "X-API-Key": API_KEY
      }
    })
      .pipe(map(responseData => {
        if (this.invoiceConverter.isRawInvoice(responseData)) {
          return this.invoiceConverter.rawToInvoice(responseData)
        }
        return undefined;
      }));
  }

  getInvoiceWithCompany(id: string) {
    return this.fetchInvoiceById(id).pipe(map(invoice => {
        if (invoice)
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
      "invoice_number": invoice.invoiceNumber,
      "due_date": this.datePipe.transform(invoice.dueDate, 'yyyy-MM-dd'),
      "company_id": invoice.company_id
    }
    return this.http.put(this.apiUrl + 'invoice/', body, {
      observe: 'response',
      headers: {
        "X-API-Key": API_KEY
      }
    })
  }

  createInvoice(invoiceNumber: string, companyId: string, dueDate: Date) {

    let body = {
      "invoice_number": invoiceNumber,
      "due_date": this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
      "company_id": companyId
    };


    if (this.companyExist(companyId)) {
      return this.http.post(this.apiUrl + 'invoice/', body,
        {
          observe: "response",
          headers: {
            "X-API-Key": API_KEY
          }
        });
    } else {
      throw new Error('this company does not exist');
    }


  }

  deleteInvoice(id: string) {

    if (this.fetchInvoiceById(id)) {
      return this.http.delete(this.apiUrl + 'invoice/' + id, {
        observe: "response",
        headers: {
          "X-API-Key": API_KEY
        }
      });
    } else {
      throw new Error('no invoice found with id ' + id);
    }
  }

  private companyExist(companyId: string) {
    return this.companiesService.getCompanytById(companyId).subscribe(c => c) !== undefined;
  }
}

