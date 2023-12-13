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
import {FooterComponent} from './components/footer/footer.component';
import {AppRoutingModule} from './routing/app-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import {InvoicesService} from "./services/invoices.service";
import {HttpClientModule} from "@angular/common/http";
import { SearchPipe } from './pipes/search.pipe';
import {FormsModule} from "@angular/forms";
import {ContactsService} from "./services/contacts.service";
import {CompaniesService} from "./services/companies.service";
import { LastPipe } from './pipes/last.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginationPipe } from './pipes/pagination.pipe';
import { ListHeaderComponent } from './components/list-header/list-header.component';
import { FilterPipe } from './pipes/filter.pipe';
import {Helpers} from "./shared/helpers";
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
    FooterComponent,
    NotFoundComponent,
    RegisterComponent,
    LoginComponent,
    SearchPipe,
    LastPipe,
    PaginationComponent,
    PaginationPipe,
    ListHeaderComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [InvoicesService, ContactsService, CompaniesService, SearchPipe, LastPipe, FilterPipe, PaginationPipe, Helpers],
  bootstrap: [AppComponent]
})
export class AppModule { }
