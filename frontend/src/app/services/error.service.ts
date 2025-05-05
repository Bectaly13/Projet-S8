import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BackendResponse } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) { }

  errorMessage(res: BackendResponse) {
    console.error("Error " + res.status + " : " + res.data);

    this.router.navigate(["error"]);
  }
}
