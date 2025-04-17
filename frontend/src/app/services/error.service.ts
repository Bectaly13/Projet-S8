import { Injectable } from '@angular/core';

import { BackendResponse } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  errorMessage(res: BackendResponse) {
    return "Erreur " + res.status + " : " + res.data;
  }
}
