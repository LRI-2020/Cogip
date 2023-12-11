import {HttpClient} from "@angular/common/http";
import {Invoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";
import {Company} from "../models/company.model";

@Injectable()
export class CompaniesService{

  constructor(private http:HttpClient) {
  }
  fetchInvoices(){
    return this.http.get<Company[]>("../assets/fakeData/companies.json")
  }
}
