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
import {AdminCompaniesComponent} from "../components/admin/admin-companies/admin-companies.component";
import {AdminDashboardComponent} from "../components/admin/admin-dashboard/admin-dashboard.component";
import {AdminCompanyDetailsComponent} from "../components/admin/admin-company-details/admin-company-details.component";
import {AdminContactsComponent} from "../components/admin/admin-contacts/admin-contacts.component";
import {AdminContactDetailsComponent} from "../components/admin/admin-contact-details/admin-contact-details.component";
import {AdminInvoicesComponent} from "../components/admin/admin-invoices/admin-invoices.component";


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
  {path: "admin/invoices", component: AdminInvoicesComponent},
  {path: "admin/contacts", component: AdminContactsComponent},
  {path: "admin/contacts/:id", component: AdminContactDetailsComponent},
  {path: "admin/companies", component: AdminCompaniesComponent},
  {path: "admin/companies/:id", component: AdminCompanyDetailsComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
}
