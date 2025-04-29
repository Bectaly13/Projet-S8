import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonToolbar, IonFooter, IonButton, ViewWillEnter, IonToggle } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/browser';

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
  imports: [IonContent, IonToolbar, CommonModule, FormsModule, NavbarComponent, IonFooter, IonButton, IonToggle, HeaderComponent]
})

export class OptionsPage implements ViewWillEnter {
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
    this.darkmode.init();

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
}
