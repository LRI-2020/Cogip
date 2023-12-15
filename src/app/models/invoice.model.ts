
export class Invoice{

  private _invoiceNumber: string;
  private _company: string;
  private _dueDate;
  private _id: Number;
  private _createdAt: Date;
  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }


  get company(): string {
    return this._company;
  }

  set company(value: string) {
    this._company = value;
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
  get id(): Number {
    return this._id;
  }

  set id(value: Number) {
    this._id = value;
  }

  constructor(id:Number,invoiceNumber:string,dueDate:Date,company:string,createdAt:Date) {

    this._id=id;
    this._invoiceNumber=invoiceNumber;
    this._dueDate=dueDate;
    this._company = company;
    this._createdAt=createdAt;
  }
}

export class RawInvoice{
  get company_name(): string {
    return this._company_name;
  }

  set company_name(value: string) {
    this._company_name = value;
  }
  get invoice_creation(): string {
    return this._invoice_creation;
  }

  get date_due(): string {
    return this._date_due;
  }

  set date_due(value: string) {
    this._date_due = value;
  }
  get ref(): string {
    return this._ref;
  }

  set ref(value: string) {
    this._ref = value;
  }
  get id(): number {
    return this._id;
  }

  private readonly _id: number;
  private _ref: string;
  private _date_due: string;
  private readonly _invoice_creation: string;
  private _company_name: string;
  constructor(id:number,ref:string,date_due:string,invoice_creation:string,company_name:string) {
    this._id = id;
    this._ref = ref;
    this._date_due = date_due;
    this._invoice_creation = invoice_creation;
    this._company_name = company_name;
  }
}

export class InvoiceConverter{

  static toInvoice(rawInvoice:RawInvoice){

    return new Invoice(rawInvoice.id, rawInvoice.ref, new Date(rawInvoice.date_due), rawInvoice.company_name, new Date(rawInvoice.invoice_creation))
  }

}
