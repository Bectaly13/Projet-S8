import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements ViewWillEnter, OnInit {
  paletteToggle!: boolean;

  constructor(private storage: StorageService,
              private router: Router) { }

  ngOnInit(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.initializeDarkPalette(prefersDark.matches);
  }

  async ionViewWillEnter() {
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
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }
            
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
