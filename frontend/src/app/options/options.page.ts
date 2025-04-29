import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonFooter, IonSegment, IonSegmentButton, IonLabel, IonToggle, IonButton, ViewWillEnter } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Preferences } from '@capacitor/preferences';

import { SharedVariablesService } from '../services/shared-variables.service';
import { StorageService } from '../services/storage.service';
import { DarkModeService } from '../services/dark-mode.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, HeaderComponent, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonToggle, CommonModule, FormsModule, NavbarComponent, IonFooter, IonButton]
})

// On ajoute OnInit pour le bouton du mode clair/sombre/auto
export class OptionsPage implements OnInit, ViewWillEnter {
  paletteToggle!: boolean;
  sectorId!: number;
  sector!: string;

  mail!: string;
  subject!: string;
  site!: string;
  facebook!: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private variables: SharedVariablesService,
              private storage: StorageService,
              private darkmode: DarkModeService) { }

  async ionViewWillEnter() {
    const dark_mode_data = await this.storage.get("dark_mode_data");
    if(dark_mode_data != null) {
      this.paletteToggle = dark_mode_data;
    }
    else {
      this.paletteToggle = document.documentElement.classList.contains('ion-palette-dark');
    }

    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));

    this.mail = this.variables.mail;
    this.subject = this.variables.faqSubject;
    this.site = this.variables.site;
    this.facebook = this.variables.facebook;
  }

  toggleChange(event: CustomEvent) {
    const shouldAdd: boolean = event.detail.checked;

    this.storage.set("dark_mode_data", shouldAdd);

    this.toggleDarkPalette(shouldAdd);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  goToFAQ() {
    this.router.navigate(["faq"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }
  
  async openBrowser(link: string) {
    await Browser.open({url: link});
  }


  // Bouton mode clair/sombre/auto

  themeMode: 'light' | 'dark' | 'system' = 'system';

  ngOnInit() {
    this.initTheme();
  }

  async initTheme() {
    const { value } = await Preferences.get({ key: 'theme' });
    this.themeMode = (value as any) || 'system';
    this.applyTheme(this.themeMode);
  }

  onThemeChange(mode: any) {
    console.log('Changement de thème :', mode); // 👈 vérifie que ça s'affiche
  
    if (mode === 'light' || mode === 'dark' || mode === 'system') {
      this.themeMode = mode;
      Preferences.set({ key: 'theme', value: mode });
      this.applyTheme(mode);
    } else {
      this.themeMode = 'system';
      Preferences.set({ key: 'theme', value: 'system' });
      this.applyTheme('system');
    }
  }

  applyTheme(mode: 'light' | 'dark' | 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Retirer les anciennes classes
    document.body.classList.remove('light', 'dark');

    // Ajouter la classe correspondante
    switch (mode) {
      case 'light':
        document.body.classList.add('light'); // Applique le mode clair
        break;
      case 'dark':
        document.body.classList.add('dark'); // Applique le mode sombre
        break;
      case 'system':
        if (prefersDark) {
          document.body.classList.add('dark'); // Système sombre si l'utilisateur le préfère
        } else {
          document.body.classList.add('light'); // Système clair sinon
        }
        break;
    }
}
}
