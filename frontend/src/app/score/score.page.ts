import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedVariablesService } from '../services/shared-variables.service';
import { DarkModeService } from '../services/dark-mode.service';

import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class ScorePage implements ViewWillEnter {
  score!: number;
  mcqSize!: number;
  sectorId!: number;
  sector!: string;
  domain!: string;
  domainId!: number;
  chapterId!: number;
  chapter!: string;

  scoreImageUrl!: string;
  scoreImageName!: string;

  messages: string[] = [
    "Ça ne va pas du tout !", // correct answers ratio in [limits[0] ; limits[1][
    "Pas mal, mais tu peux mieux faire !", // correct answers ration in [limits[1] ; limits[2][
    "Tu es sur la bonne voie !",
    "Tu as tout bon !" // correct answers ratio = 1 (perfect)
  ];
  limits: number[] = [
    0,
    0.3,
    0.6,
    1
  ];  

  message!: string;  

  constructor(private route: ActivatedRoute,
              private router: Router,
              private variables: SharedVariablesService,
              private darkmode: DarkModeService) { }

  ionViewWillEnter(): void {
    this.score = Number(this.route.snapshot.queryParamMap.get("score"));
    this.mcqSize = Number(this.route.snapshot.queryParamMap.get("mcqSize"));
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));

    this.scoreImageUrl = this.variables.scoreImageUrl;

    const ratio = this.score/this.mcqSize;

    for(let i=this.limits.length - 1; i>=0; i--) {
      if(ratio >= this.limits[i]) {
        this.message = this.messages[i];
        this.scoreImageName = this.scoreImageUrl + "score" + String(i) + ".jpg";
        break;
      }
    }
  }

  retry() {
    this.router.navigate(["start-mcq"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector,
      domain: this.domain,
      domainId: this.domainId,
      chapterId: this.chapterId,
      chapter: this.chapter
    }})
  }

  backToMenu() {
    this.router.navigate(["domains"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }

}
