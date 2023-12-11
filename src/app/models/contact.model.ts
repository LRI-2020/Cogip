export class Contact{
  private _name: string;
  private _email: string;
  private _phone: string;
  private _createdAt:Date;
  private _company: string;
  private _id: Number;

  get id(): Number {
    return this._id;
  }

  set id(value: Number) {
    this._id = value;
  }
  get company(): string {
    return this._company;
  }

  set company(value: string) {
    this._company = value;
  }
  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    this._createdAt = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
  get phone(): string {
    return this._phone;
  }

  set phone(value: string) {
    this._phone = value;
  }
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }


  constructor(id:Number,name:string,phone:string,email:string,company:string,createdAt:Date) {
    this._id=id;
    this._name=name;
    this._phone=phone;
    this._email=email;
    this._company=company;
    this._createdAt=createdAt;
  }
}
