
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
