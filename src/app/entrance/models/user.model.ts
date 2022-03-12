import { Card } from './card.model';
import { Movements } from './movement.model';

export class User {
  constructor(
    public name: string,
    public email: string,
    public id: string,
    public DBuserId: string,
    public card: Card,
    public movements: Movements[],
    public balance: number,
    private _token: string,
    private _expireDate: Date
  ) {}

  get token() {
    if (!this._expireDate || new Date() > this._expireDate) return null;
    return this._token;
  }

  get expireDate() {
    return this._expireDate;
  }
}
