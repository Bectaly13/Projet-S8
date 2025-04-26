import { Injectable } from '@angular/core';

import { BackendResponse } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  errorMessage(res: BackendResponse) {
    console.error("Error " + res.status + " : " + res.data);
  }
}
