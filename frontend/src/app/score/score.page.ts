import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class ScorePage implements ViewWillEnter {
  score!: number;
  mcqSize!: number;
  sectorId!: number;
  sector!: string;
  domain!: string;
  chapterId!: number;
  chapter!: string;
  imageName!: string;

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
              private router: Router) { }

  ionViewWillEnter(): void {
    this.score = Number(this.route.snapshot.queryParamMap.get("score"));
    this.mcqSize = Number(this.route.snapshot.queryParamMap.get("mcqSize"));
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));
    this.imageName = String(this.route.snapshot.queryParamMap.get("imageName"));

    const ratio = this.score/this.mcqSize;

    for(let i=this.limits.length - 1; i>=0; i--) {
      if(ratio >= this.limits[i]) {
        this.message = this.messages[i];
        break;
      }
    }
  }

  retry() {
    this.router.navigate(["start-mcq"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector,
      domain: this.domain,
      chapterId: this.chapterId,
      chapter: this.chapter,
      imageName: this.imageName
    }})
  }

  backToMenu() {
    this.router.navigate(["domains"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector
    }})
  }

}
