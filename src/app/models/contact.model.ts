
export class Contact {
  get photo(): string {
    return this._photo;
  }

  set photo(value: string) {
    this._photo = value;
  }

  private _name: string;
  private _email: string;
  private _phone: string;
  private _createdAt: Date;
  private _company: string;
  private _id: number;
  private _photo: string;

  get id(): number {
    return this._id;
  }

  set id(value: number) {
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


  constructor(id: number, name: string, phone: string, email: string, company: string, createdAt: Date, photo?: string) {
    this._id = id;
    this._name = name;
    this._phone = phone;
    this._email = email;
    this._company = company;
    this._createdAt = createdAt;
    this._photo = photo ? photo : '';
  }
}

export class RawContact {
  get contact_creation(): string {
    return this._contact_creation;
  }

  private readonly _contact_creation: string;
  get company_name(): string {
    return this._company_name;
  }

  set company_name(value: string) {
    this._company_name = value;
  }
  private _company_name: string;
  get phone(): string {
    return this._phone;
  }

  set phone(value: string) {
    this._phone = value;
  }
  private _phone: string;
  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
  private _email: string;
  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
  private readonly _id: number;
  private _name: string;

  constructor(id: number, name: string, email: string, phone: string, company_name: string, contact_creation: string) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._company_name = company_name;
    this._contact_creation = contact_creation;
  }
}

export class ContactConverter{

 static toContact(rawContact:RawContact){
    return new Contact(rawContact.id,rawContact.name,
      rawContact.phone, rawContact.email,
      rawContact.company_name, new Date(rawContact.contact_creation));
  }
}


