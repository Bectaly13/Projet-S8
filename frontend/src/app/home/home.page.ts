import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { SharedVariablesService } from '../services/shared-variables.service';
import { DarkModeService } from '../services/dark-mode.service';
import { UpdateQuestionsDataService } from '../services/update-questions-data.service';

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
              private darkmode: DarkModeService,
              private update: UpdateQuestionsDataService) { }

  async ionViewWillEnter() {
    this.darkmode.init(); // récupération des préférences relatives au thème sombre

    this.version = this.variables.version;
    
    let questions_data = await this.storage.get("questions_data");
    if(!questions_data) {
      // Si l'utilisateur n'a pas de données relatives aux questions (première utilisation), on crée un objet vide.
      questions_data = {};
      this.storage.set("questions_data", questions_data);
    }

    const sector_data = await this.storage.get("sector_data");
    if(sector_data) {
      // Si l'utilisateur a une filière enregistrée...
      const sectorId: number = sector_data.sectorId;
      const sector: string = sector_data.sector;

      // ...on met à jour les questions relatives à cette filière (si modification de la BDD)...
      this.update.updateQuestionsData(sectorId);

      // ...et on l'envoie directement sur l'écran de sélection des domaines.
      setTimeout(() => {
        this.router.navigate(["domains"], {queryParams: {
          sectorId: sectorId,
          sector: sector
        }})
      }, 2000);      
    }
    else {
      // Sinon, on l'envoie sur l'écran de sélection des filières.
      setTimeout(() => {
        this.router.navigate(["sectors"]);
      }, 2000);  
    }
  }
}
