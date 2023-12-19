export class Company {
  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get id(): string {
    return this._id;
  }

  private _createdAt: Date;
  private readonly _id: string;

  get type(): CompanyType {
    return this._type;
  }

  set type(value: CompanyType) {
    this._type = value;
  }

  private _type: CompanyType;

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

  constructor(id: string, name: string, tva: string, country: string, type: CompanyType, createdAt: Date) {
    this._id = id;
    this._name = name;
    this._tva = tva;
    this._country = country;
    this._type = type;
    this._createdAt = createdAt;

  }
}
export class CompanyRawModel {
  get creationDate(): string {
    return this._creationDate;
  }

  private readonly _creationDate: string;

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

  get id(): string {
    return this._id;
  }

  private readonly _id: string;

  constructor(id: string, company_name: string, type_name: string, country: string, tva: string, company_creation: string) {
    this._id = id;
    this._company_name = company_name;
    this._type_name = type_name;
    this._country = country;
    this._tva = tva;
    this._creationDate = company_creation;
  }
}

export enum CompanyType {
  client = 0,
  supplier = 1,
}




