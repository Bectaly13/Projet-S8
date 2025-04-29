import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

import { DarkModeService } from '../services/dark-mode.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-stats-domain',
  templateUrl: './stats-domain.page.html',
  styleUrls: ['./stats-domain.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, NavbarComponent]
})
export class StatsDomainPage implements ViewWillEnter {
  sectorId!: number;
  sector!: string;
  domainId!: number;
  domain!: string;
  correct!: number;
  incorrect!: number;
  total!: number;

  constructor(private darkmode: DarkModeService,
              private route: ActivatedRoute) { }

  ionViewWillEnter() {
    this.darkmode.init();

    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.correct = Number(this.route.snapshot.queryParamMap.get("correct"));
    this.incorrect = Number(this.route.snapshot.queryParamMap.get("incorrect"));
    this.total = Number(this.route.snapshot.queryParamMap.get("total"));
  }
}
