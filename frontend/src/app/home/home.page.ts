import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class HomePage implements ViewWillEnter {

  constructor(private storage: StorageService,
              private router: Router,
              private message: MessageService,
              private error: ErrorService,
              private variables: SharedVariablesService) { }

  async ionViewWillEnter() {
    const dark_mode_data = await this.storage.get("dark_mode_data");
    if(dark_mode_data != null) {
      this.initializeDarkPalette(dark_mode_data);
    }
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.initializeDarkPalette(prefersDark.matches);
    }

    let questions_data = await this.storage.get("questions_data");
    if(!questions_data) {
      questions_data = {};
      this.message.sendMessage("getDefaultQuestionsData", {mcqSize: this.variables.mcqSize.large}).subscribe(res => {
        console.log(res);
        if(res.status == 200) {
          this.storage.set("questions_data", res.data);
        }
        else {
          this.error.errorMessage(res);
        }
      })
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
      }, 1500);      
    }
    else {
      setTimeout(() => {
        this.router.navigate(["sectors"]);
      }, 1500);  
    }
  }

  initializeDarkPalette(isDark: boolean) {
    this.toggleDarkPalette(isDark);
  }
            
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
