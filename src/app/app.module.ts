import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {HeaderComponent} from "./components/header/header.component";
import {WelcomePageComponent} from "./components/welcome-page/welcome-page.component";
import {InvoicesListComponent} from "./components/invoices-list/invoices-list.component";
import {ContactsListComponent} from "./components/contacts-list/contacts-list.component";
import {ContactDetailsComponent} from "./components/contact-details/contact-details.component";
import {CompaniesListComponent} from "./components/companies-list/companies-list.component";
import {CompanyDetailsComponent} from "./components/company-details/company-details.component";
import {FooterComponent} from "./components/footer/footer.component";
import {AppRoutingModule} from "./routing/app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WelcomePageComponent,
    InvoicesListComponent,
    ContactsListComponent,
    ContactDetailsComponent,
    CompaniesListComponent,
    CompanyDetailsComponent,
    FooterComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
