import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicesService} from "../../../services/invoices.service";
import {Invoice} from "../../../models/invoice.model";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-admin-invoice-details',
  templateUrl: './admin-invoice-details.component.html',
  styleUrl: './admin-invoice-details.component.scss'
})
export class AdminInvoiceDetailsComponent implements OnInit, OnDestroy {

  invoice: Invoice | undefined;
  isLoading = true;
  subscriptionsList: Subscription[] = [];
  inError = false;

  constructor(private route: ActivatedRoute, private invoicesService: InvoicesService, private router: Router, private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    this.loadData(id);

    this.subscriptionsList.push(this.route.params.subscribe((params) => {
      let id = params['id'];
      this.loadData(id);
    }))

  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach(s => s.unsubscribe());
  }

  loadData(id: string) {
    this.isLoading = true;
    this.subscriptionsList.push(this.invoicesService.getInvoiceBy(id).subscribe({
      next: invoicesData => {
        this.invoice = invoicesData;
        this.inError = false;
        this.isLoading = false;
      },
      error: () => {
        this.inError = true;
        this.notificationsService.error('Oh Oh 😕', "The invoice details could not be loaded");

        this.isLoading = false;
      }
    }));
  }


  onDelete(id: string) {
    try {
      this.invoicesService.deleteInvoice(id).subscribe({
        next: response => {
          if (response.ok) {
            this.notificationsService.success('Success', "The invoice has been deleted");
            this.router.navigate(['/invoices']);
          }
        },
        error: () => {
          this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted");
        }
      });
    } catch (e) {
      if (e instanceof Error){
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted : "+e.message);
      }

      else {
        this.notificationsService.error('Oh Oh 😕', "The invoice has not been deleted");
      }
    }
  }
}
