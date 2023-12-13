import {HttpClient} from "@angular/common/http";
import {Invoice} from "../models/invoice.model";
import {Injectable} from "@angular/core";
import {Company} from "../models/company.model";
import {map} from "rxjs";

@Injectable()
export class CompaniesService{

  constructor(private http:HttpClient) {
  }
  fetchCompanies(){
    return this.http.get<Company[]>("../assets/fakeData/companies.json")
  }

  getCompanytById(id: number) {
    return this.fetchCompanies().pipe(map(companiesData => companiesData.find(c => c.id === id)));
  }
}
