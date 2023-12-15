
export class Company {
  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  private _createdAt: Date;
  private _id: number;

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  private _type: string;

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  private _country: string;

  get tva(): string {
    return this._tva;
  }

  set tva(value: string) {
    this._tva = value;
  }

  private _tva: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  private _name: string;

  constructor(id: number, name: string, tva: string, country: string, type: string, createdAt: Date) {
    this._id = id;
    this._name = name;
    this._tva = tva;
    this._country = country;
    this._type = type;
    this._createdAt = createdAt;

  }
}
export class CompanyConverter {

  constructor() {
  }

  static rawToCompany(rawCompany: CompanyRawModel) {
    return new Company(rawCompany.id,
      rawCompany.company_name,
      rawCompany.tva,
      rawCompany.country,
      rawCompany.type_name,
      new Date(rawCompany.company_creation));
  }



}

export class CompanyRawModel {
  get company_creation(): string {
    return this._company_creation;
  }

  private readonly _company_creation: string;

  get tva(): string {
    return this._tva;
  }

  set tva(value: string) {
    this._tva = value;
  }

  private _tva: string;

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  private _country: string;

  get type_name(): string {
    return this._type_name;
  }

  set type_name(value: string) {
    this._type_name = value;
  }

  private _type_name: string;

  get company_name(): string {
    return this._company_name;
  }

  set company_name(value: string) {
    this._company_name = value;
  }

  private _company_name: string;

  get id(): number {
    return this._id;
  }

  private readonly _id: number;

  constructor(id: number, company_name: string, type_name: string, country: string, tva: string, company_creation: string) {
    this._id = id;
    this._company_name = company_name;
    this._type_name = type_name;
    this._country = country;
    this._tva = tva;
    this._company_creation = company_creation;
  }
}



