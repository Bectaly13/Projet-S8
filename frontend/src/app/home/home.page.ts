import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { SharedVariablesService } from '../services/shared-variables.service';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class HomePage implements ViewWillEnter {
  version!: string;

  constructor(private storage: StorageService,
              private router: Router,
              private variables: SharedVariablesService,
              private darkmode: DarkModeService) { }

  async ionViewWillEnter() {
    this.darkmode.init();

    this.version = this.variables.version;
    
    let questions_data = await this.storage.get("questions_data");
    if(!questions_data) {
      questions_data = {};
      this.storage.set("questions_data", questions_data);
    }

    const sector_data = await this.storage.get("sector_data");
    if(sector_data) {
      const sectorId: number = sector_data.sectorId;
      const sector: string = sector_data.sector;

      setTimeout(() => {
        this.router.navigate(["domains"], {queryParams: {
          sectorId: sectorId,
          sector: sector
        }})
      }, 2000);      
    }
    else {
      setTimeout(() => {
        this.router.navigate(["sectors"]);
      }, 2000);  
    }
  }
}
