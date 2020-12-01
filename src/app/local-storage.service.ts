import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  token: string;

  constructor() {this.token = "" }

  setToken(token: string){
    this.token = token;
  }
  getToken(){
    return this.token;
  }
}
