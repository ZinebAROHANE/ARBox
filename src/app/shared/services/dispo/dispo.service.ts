import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class DispoService {

  dispo: number;

  constructor() { 
    this.dispo = 100000000;
  }

  setUserDispo(dispo: number){
    const user = JSON.parse(localStorage.getItem('user'));
    user.dispo = dispo;
    this.dispo = dispo;
  }

  getDispo(){
    return this.dispo;
  }

}
