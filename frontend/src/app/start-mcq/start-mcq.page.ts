import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButtons, IonBackButton, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-start-mcq',
  templateUrl: './start-mcq.page.html',
  styleUrls: ['./start-mcq.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonButton]
})
export class StartMCQPage implements ViewWillEnter {
  sectorId!: number;
  domain!: string;
  chapterId!: number;
  chapter!: string;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ionViewWillEnter(): void {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));
  }

  startMCQ() {
    this.router.navigate(["study"], {queryParams: {
      sectorId: this.sectorId,
      chapterId: this.chapterId
    }})
  }

  goToSkills() {
    this.router.navigate(["skills"], {queryParams: {
      sectorId: this.sectorId,
      domain: this.domain,
      chapterId: this.chapterId,
      chapter: this.chapter
    }})
  }
}
