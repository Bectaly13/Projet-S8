import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BackendResponse } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) { }

  errorMessage(res: BackendResponse) {
    // affichage propre de l'erreur dans le console
    console.error("Error " + res.status + " : " + res.data);

    // redirection de l'utilisateur vers une page d'erreur permettant de recharger l'application
    this.router.navigate(["error"]);
  }
}
