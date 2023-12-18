import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Invoice} from "../models/invoice.model";
import {InvoicesService} from "./invoices.service";

export class InvoiceResolverService implements ResolveFn<Invoice> {
  constructor(private invoicesService:InvoicesService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.invoicesService.fetchInvoices();
  }

}
