
export class Contact {
  get company_name(): string {
    return this._company_name;
  }

  set company_name(value: string) {
    this._company_name = value;
  }
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
  private _company_name: string='';
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
  get creation_date(): string {
    return this._creation_date;
  }

  private readonly _creation_date: string;
  get company_id(): string {
    return this._company_id;
  }

  set company_id(value: string) {
    this._company_id = value;
  }
  private _company_id: string;
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

  constructor(id: number, name: string, email: string, phone: string, company_id: string, creation_date: string) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._company_id = company_id;
    this._creation_date = creation_date;
  }


}



