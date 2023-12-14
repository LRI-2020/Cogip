import {HttpClient} from "@angular/common/http";
import {Invoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";
import {map} from "rxjs";

@Injectable()
export class InvoicesService{

  constructor(private http:HttpClient) {
  }
  fetchInvoices(){
    return this.http.get<Invoice[]>("../assets/fakeData/invoices.json")
  }

  getInvoiceBy(id: number) {
    return this.fetchInvoices().pipe(map(invoicesData => invoicesData.find(inv => inv.id === id)))
  }
}
