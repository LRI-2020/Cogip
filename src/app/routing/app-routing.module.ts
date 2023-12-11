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


const appRoutes: Routes = [
  {path: "", component: WelcomePageComponent, pathMatch: "full"},
  {path: "invoices", component: InvoicesListComponent},
  {path: "contacts", component: ContactsListComponent, children: [
      {path: ":id", component: ContactDetailsComponent},
    ]
  },
  {path: "companies", component: CompaniesListComponent, children: [
      {path: ":id", component: CompanyDetailsComponent},
    ]
  },
  {path: "register", component: RegisterComponent},
  {path: "login", component: LoginComponent},

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
}
