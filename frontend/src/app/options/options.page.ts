import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, ViewWillEnter, IonToggle, AlertController } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { DarkModeService } from '../services/dark-mode.service';
import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, NavbarComponent, IonButton, IonToggle, HeaderComponent]
})

export class OptionsPage implements ViewWillEnter {
  paletteToggle!: boolean;

  sectorId!: number;
  sector!: string;

  mcqSize!: number;
  version!: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private storage: StorageService,
              private darkmode: DarkModeService,
              private alert: AlertController,
              private message: MessageService,
              private error: ErrorService,
              private variables: SharedVariablesService) { }

  async ionViewWillEnter() {
    this.darkmode.init();

    this.mcqSize = this.variables.mcqSize.large;
    this.version = this.variables.version;

    const dark_mode_data = await this.storage.get("dark_mode_data");
    if(dark_mode_data != null) {
      this.paletteToggle = dark_mode_data;
    }
    else {
      this.paletteToggle = document.documentElement.classList.contains('ion-palette-dark');
    }

    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
  }

  toggleChange(event: CustomEvent) {
    const shouldAdd: boolean = event.detail.checked;

    this.storage.set("dark_mode_data", shouldAdd);

    this.toggleDarkPalette(shouldAdd);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  async clearProgress() {
    const alert = await this.alert.create({
      header: "Supprimer vos données pour cette filière ?",
      message: "Cette action est irréversible.",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
        },
        {
          text: "Supprimer",
          handler: async () => {
            this.message.sendMessage("getDefaultQuestionsData", {sectorId: this.sectorId, mcqSize: this.mcqSize}).subscribe(async res => {
              console.log(res);
              if(res.status == 200) {
                let questions_data = await this.storage.get("questions_data");
                questions_data[this.sectorId] = res.data[this.sectorId];
                this.storage.set("questions_data", questions_data);
              }
              else {
                this.error.errorMessage(res);
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  async clearOtherProgress() {
    const alert = await this.alert.create({
      header: "Supprimer vos données pour les autres filières ?",
      message: "Cette action est irréversible.",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
        },
        {
          text: "Supprimer",
          handler: async () => {
            let questions_data = await this.storage.get("questions_data");
            
            for(let sectorId of Object.keys(questions_data)) {
              if(Number(sectorId) != this.sectorId) {
                delete questions_data[sectorId];
              }
            }

            this.storage.set("questions_data", questions_data);
          },
        },
      ],
    });

    await alert.present();
  }

  async clearAllProgress() {
    const alert = await this.alert.create({
      header: "Supprimer toutes vos données ?",
      message: "Cette action est irréversible.",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
        },
        {
          text: "Supprimer",
          handler: () => {
            this.message.sendMessage("getDefaultQuestionsData", {sectorId: this.sectorId, mcqSize: this.mcqSize}).subscribe(res => {
              console.log(res);
              if(res.status == 200) {
                this.storage.set("questions_data", res.data);
              }
              else {
                this.error.errorMessage(res);
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  goToFAQ() {
    this.router.navigate(["faq"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }
}
