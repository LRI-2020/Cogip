import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {InvoicesListComponent} from "../components/invoices-list/invoices-list.component";
import {ContactsListComponent} from "../components/contacts-list/contacts-list.component";
import {ContactDetailsComponent} from "../components/contact-details/contact-details.component";
import {CompaniesListComponent} from "../components/companies-list/companies-list.component";
import {CompanyDetailsComponent} from "../components/company-details/company-details.component";
import {WelcomePageComponent} from "../components/welcome-page/welcome-page.component";
import {NotFoundComponent} from "../components/not-found/not-found.component";
import {RegisterComponent} from "../components/register/register.component";
import {LoginComponent} from "../components/login/login.component";
import {AdminCompaniesListComponent} from "../components/admin/admin-companies-list/admin-companies-list.component";
import {AdminDashboardComponent} from "../components/admin/admin-dashboard/admin-dashboard.component";
import {AdminCompanyDetailsComponent} from "../components/admin/admin-company-details/admin-company-details.component";
import {AdminContactsComponent} from "../components/admin/admin-contacts/admin-contacts.component";
import {AdminContactDetailsComponent} from "../components/admin/admin-contact-details/admin-contact-details.component";
import {AdminInvoicesListComponent} from "../components/admin/admin-invoices-list/admin-invoices-list.component";
import {AdminInvoiceDetailsComponent} from "../components/admin/admin-invoice-details/admin-invoice-details.component";
import {EditInvoiceComponent} from "../components/admin/edit-invoice/edit-invoice.component";
import {AdminInvoicesComponent} from "../components/admin/admin-invoices/admin-invoices.component";
import {AdminCompaniesComponent} from "../components/admin/admin-companies/admin-companies.component";
import {EditCompanyComponent} from "../components/admin/edit-company/edit-company.component";


const appRoutes: Routes = [
  {path: "", component: WelcomePageComponent, pathMatch: "full"},
  {path: "invoices", component: InvoicesListComponent},
  {path: "contacts", component: ContactsListComponent},
  {path: "contacts/:id", component: ContactDetailsComponent},
  {path: "companies", component: CompaniesListComponent},
  {path: "companies/:id", component: CompanyDetailsComponent},
  {path: "register", component: RegisterComponent},
  {path: "login", component: LoginComponent},
  {path: "admin", component: AdminDashboardComponent},
  {path: "admin/invoices", component:AdminInvoicesComponent, children:[
      {path: "", component: AdminInvoicesListComponent},
      {path: "new", component: EditInvoiceComponent},
      {path: ":id", component: AdminInvoiceDetailsComponent},
      {path: ":id/edit", component: EditInvoiceComponent},
    ]},

  {path: "admin/contacts", component: AdminContactsComponent},
  {path: "admin/contacts/:id", component: AdminContactDetailsComponent},
  {path: "admin/companies", component: AdminCompaniesComponent, children:[
      {path: "", component: AdminCompaniesListComponent},
      {path: "new", component: EditCompanyComponent},
      {path: ":id", component: AdminCompanyDetailsComponent},
      {path: ":id/edit", component: EditCompanyComponent},
    ]},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
}
