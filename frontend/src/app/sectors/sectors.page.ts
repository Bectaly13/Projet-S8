import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

export interface Sector {
  sectorId: number;
  name: string;
}

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.page.html',
  styleUrls: ['./sectors.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class SectorsPage implements ViewWillEnter, OnInit {
  paletteToggle!: boolean;

  sectors!: Sector[];

  constructor(private message: MessageService,
              private error: ErrorService,
              private router: Router) { }

  ngOnInit(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.initializeDarkPalette(prefersDark.matches);
  }

  ionViewWillEnter() {
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

  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  goToDomains(index: number, sector: string) {
    this.router.navigate(["domains"], {queryParams: {
      sectorId: index,
      sector: sector
    }});
  }

}
