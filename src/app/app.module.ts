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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ContactsService} from "./services/contacts.service";
import {CompaniesService} from "./services/companies.service";
import { LastPipe } from './pipes/last.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginationPipe } from './pipes/pagination.pipe';
import { ListHeaderComponent } from './components/list-header/list-header.component';
import { FilterPipe } from './pipes/filter.pipe';
import {Helpers} from "./shared/helpers";
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminCompaniesListComponent } from './components/admin/admin-companies-list/admin-companies-list.component';
import { AdminHeaderComponent } from './components/admin/admin-header/admin-header.component';
import { AdminListHeaderComponent } from './components/admin/admin-list-header/admin-list-header.component';
import { AdminContactsListComponent } from './components/admin/admin-contacts-list/admin-contacts-list.component';
import { AdminInvoicesListComponent } from './components/admin/admin-invoices-list/admin-invoices-list.component';
import { AdminCompanyDetailsComponent } from './components/admin/admin-company-details/admin-company-details.component';
import { EditInvoiceComponent } from './components/admin/edit-invoice/edit-invoice.component';
import { AdminInvoicesComponent } from './components/admin/admin-invoices/admin-invoices.component';
import {DatePipe} from "@angular/common";
import { NotificationsComponent } from './components/notifications/notifications.component';
import { EditCompanyComponent } from './components/admin/edit-company/edit-company.component';
import { AdminCompaniesComponent } from './components/admin/admin-companies/admin-companies.component';
import { AdminContactsComponent } from './components/admin/admin-contacts/admin-contacts.component';
import { EditContactComponent } from './components/admin/edit-contact/edit-contact.component';
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
    FilterPipe,
    AdminDashboardComponent,
    AdminCompaniesListComponent,
    AdminHeaderComponent,
    AdminListHeaderComponent,
    AdminContactsListComponent,
    AdminInvoicesListComponent,
    AdminCompanyDetailsComponent,
    EditInvoiceComponent,
    AdminInvoicesComponent,
    NotificationsComponent,
    EditCompanyComponent,
    AdminCompaniesComponent,
    AdminContactsComponent,
    EditContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [InvoicesService, ContactsService, CompaniesService, SearchPipe, LastPipe, FilterPipe, PaginationPipe, Helpers, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
