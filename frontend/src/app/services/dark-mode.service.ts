import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  constructor(private storage: StorageService) {
    this.init();
  }

  async init() {
    // on récupère les préférences utilisateurs sur l'application
    // celles-ci ne sont définies que si l'utilisateur a lui-même manuellement configuré le thème sombre
    const dark_mode_data = await this.storage.get("dark_mode_data");
    if(dark_mode_data != null) {
      // si l'utilisateur a configuré le thème sombre, on applique sa préférence
      document.documentElement.classList.toggle('ion-palette-dark', dark_mode_data);
    }
    else {
      // si l'utilisateur n'a jamais touché à ce paramètre, on récupère les préférences de l'appareil
      document.documentElement.classList.toggle('ion-palette-dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }
}
