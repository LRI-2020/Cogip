
export class Invoice{
  get company_name(): string {
    return this._company_name;
  }

  set company_name(value: string) {
    this._company_name = value;
  }

  private _invoiceNumber: string;
  private _company_id: string;
  private _dueDate;
  private readonly _id: string;
  private _createdAt: Date;
  private _company_name:string='';
  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }


  get company_id(): string {
    return this._company_id;
  }

  set company_id(value: string) {
    this._company_id = value;
  }
  get invoiceNumber(): string {
    return this._invoiceNumber;
  }

  set invoiceNumber(value: string) {
    this._invoiceNumber = value;
  }
  get dueDate() {
    return this._dueDate;
  }

  set dueDate(value) {
    this._dueDate = value;
  }
  get id(): string {
    return this._id;
  }

  constructor(id:string,invoiceNumber:string,dueDate:Date,company:string,createdAt:Date) {

    this._id=id;
    this._invoiceNumber=invoiceNumber;
    this._dueDate=dueDate;
    this._company_id = company;
    this._createdAt=createdAt;
  }
}

export class RawInvoice{
  get company_id(): string {
    return this._company_id;
  }

  set company_id(value: string) {
    this._company_id = value;
  }
  get creationDate(): string {
    return this._creationDate;
  }

  get due_date(): string {
    return this._due_date;
  }

  set due_date(value: string) {
    this._due_date = value;
  }
  get invoice_number(): string {
    return this._invoice_number;
  }

  set invoice_number(value: string) {
    this._invoice_number = value;
  }
  get id(): string {
    return this._id;
  }

  private readonly _id: string;
  private _invoice_number: string;
  private _due_date: string;
  private readonly _creationDate: string;
  private _company_id: string;
  constructor(id:string,ref:string,date_due:string,invoice_creation:string,company_id:string) {
    this._id = id;
    this._invoice_number = ref;
    this._due_date = date_due;
    this._creationDate = invoice_creation;
    this._company_id = company_id;
  }
}

