export class User {
  constructor(
    public name: string,
    public email: string,
    public id: string,
    public DBuserId: string,
    public cards: {
      name: string;
      number: string;
      cvv2: number;
      exp: Date;
    },
    // movements : {}
    private _token: string,
    private _expireDate: Date
  ) {}

  get token() {
    if (!this._expireDate || new Date() > this._expireDate) return null;
    return this._token;
  }
}