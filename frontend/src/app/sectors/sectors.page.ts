import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { StorageService } from '../services/storage.service';
import { DarkModeService } from '../services/dark-mode.service';
import { SharedVariablesService } from '../services/shared-variables.service';

import { HeaderComponent } from '../header/header.component';

export interface Sector {
  sectorId: number;
  name: string;
}

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.page.html',
  styleUrls: ['./sectors.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, FormsModule, IonButton]
})
export class SectorsPage implements ViewWillEnter {
  sectors!: Sector[];

  constructor(private message: MessageService,
              private error: ErrorService,
              private router: Router,
              private storage: StorageService,
              private darkmode: DarkModeService,
              private variables: SharedVariablesService) { }

  ionViewWillEnter() {
    this.darkmode.init();

    this.message.sendMessage("getSectors", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.sectors = res.data;
      }
      else {
        console.log(this.error.errorMessage(res));
      }
    })
  }

  async goToDomains(index: number, sector: string) {
    let questions_data = await this.storage.get("questions_data");
    if(!(index in questions_data)) {
      this.message.sendMessage("getDefaultQuestionsData", {sectorId: index, mcqSize: this.variables.mcqSize.large}).subscribe(res => {
        console.log(res);
        if(res.status == 200) {
          questions_data[index] = res.data[index];
          this.storage.set("questions_data", questions_data);
        }
        else {
          this.error.errorMessage(res);
        }
      })
    }

    this.storage.set("sector_data", {
      sectorId: index,
      sector: sector
    });

    this.router.navigate(["domains"], {queryParams: {
      sectorId: index,
      sector: sector
    }});
  }

}
