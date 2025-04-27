import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton, ViewWillEnter, IonToggle } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/browser';

import { SharedVariablesService } from '../services/shared-variables.service';

import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, IonFooter, IonButton, IonToggle]
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
              private variables: SharedVariablesService) { }

  ionViewWillEnter(): void {
    this.paletteToggle = document.documentElement.classList.contains('ion-palette-dark');

    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));

    this.mail = this.variables.mail;
    this.subject = this.variables.faqSubject;
    this.site = this.variables.site;
    this.facebook = this.variables.facebook;
  }

  toggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
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
