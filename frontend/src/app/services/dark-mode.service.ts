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
    const dark_mode_data = await this.storage.get("dark_mode_data");
    if(dark_mode_data != null) {
      document.documentElement.classList.toggle('ion-palette-dark', dark_mode_data);
    }
    else {
      document.documentElement.classList.toggle('ion-palette-dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }
}
