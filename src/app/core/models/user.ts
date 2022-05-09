export class User {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  groups?: string[];
  access?: string;
  refresh?: string;
  constructor(
    id?: number,
  username?: string,
  first_name?: string,
  last_name?: string,
  groups?: string[],
  access?: string,
  refresh?: string,
  ){
    this.id = id;
    this.refresh = refresh;

  }
}
