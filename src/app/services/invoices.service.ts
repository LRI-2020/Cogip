import {HttpClient} from "@angular/common/http";
import {Invoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";

@Injectable()
export class InvoicesService{

  constructor(private http:HttpClient) {
  }
  fetchInvoices(){
    return this.http.get<Invoice[]>("../assets/fakeData/invoices.json")
  }
}
