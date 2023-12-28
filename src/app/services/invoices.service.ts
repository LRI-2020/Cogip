import {HttpClient} from "@angular/common/http";
import {Invoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";
import {catchError, concatMap, map, mergeAll, mergeMap, of, toArray} from "rxjs";
import {CompaniesService} from "./companies.service";
import {InvoiceConverterService} from "./converters/invoice-converter.service";
import {DatePipe} from "@angular/common";
import {Company} from "../models/company.model";
import {environment} from "../../environments/environment";

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
            catchError(() => of(true)),
            map(company => {
                invoice.company_name = company && company instanceof Company ? company.name : invoice.company_name;
                return invoice;
              }
            ))
        }),
      toArray())
  }

  private fetchInvoices() {

    return this.http.get<any[]>(this.apiUrl + 'invoice', {
      headers: {
        "X-API-Key": environment.cogipApiKey
      }
    }).pipe(map(responseData => {
      let invoices: Invoice[] = [];
      responseData.forEach((d: any) => {
        if (this.invoiceConverter.isRawInvoice(d)) {
          let invoice = this.invoiceConverter.rawToInvoice(d);
          invoices.push(invoice);
        }
      })
      return invoices;
    }));
  }

  fetchInvoiceById(id: string) {
    return this.http.get(this.apiUrl + 'invoice/' + id, {
      headers: {
        "X-API-Key": environment.cogipApiKey

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
          return this.companiesService.getCompanytById(invoice.company_id).pipe(
            map(company => {
            invoice.company_name = company ? company.name : invoice.company_name;
            return invoice
          }),
            catchError(()=> of(invoice))
          )
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
        "X-API-Key": environment.cogipApiKey

      }
    })
  }

  createInvoice(invoiceNumber: string, companyId: string, dueDate: Date) {
    let body = {
      "invoice_number": invoiceNumber,
      "due_date": this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
      "company_id": companyId
    };

    return this.companyExist(companyId).pipe(
      concatMap(exist => {
          if (exist) {
            return this.http.post(this.apiUrl + 'invoice/', body,
              {
                observe: "response",
                headers: {
                  "X-API-Key": environment.cogipApiKey

                }
              });
          }
          throw new Error('this company does not exist');
        }
      ))
  }

  deleteInvoice(id: string) {

    if (this.fetchInvoiceById(id)) {
      return this.http.delete(this.apiUrl + 'invoice/' + id, {
        observe: "response",
        headers: {
          "X-API-Key": environment.cogipApiKey

        }
      });
    } else {
      throw new Error('no invoice found with id ' + id);
    }
  }

  private companyExist(companyId: string) {
    return this.companiesService.getCompanytById(companyId).pipe(
      map(c => {
        console.log('c instance of company : ' + (c instanceof Company))
        return c instanceof Company;
      }),
      catchError(() => {
        return of(false)
      })
    )
  }
}

