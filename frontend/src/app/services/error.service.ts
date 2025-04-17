import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  errorMessage(res: any) {
    return "Erreur " + res.status + " : " + res.data;
  }
}
