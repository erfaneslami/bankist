export class User {
  constructor(
    public name: string,
    public email: string,
    public id: string,
    public cards: [],
    private _token: string,
    private _expireDate: Date
  ) {}

  get token() {
    if (!this._expireDate || new Date() > this._expireDate) return null;
    return this._token;
  }
}
