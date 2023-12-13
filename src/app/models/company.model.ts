export class Company{
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

  constructor(id:number,name:string, tva:string, country : string, type:string, createdAt:Date) {
    this._id=id;
    this._name=name;
    this._tva=tva;
    this._country=country;
    this._type=type;
    this._createdAt= createdAt;

  }
}
