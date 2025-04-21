import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonList, IonItem, IonButton, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

export interface Skill {
  skillId: number;
  name: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.page.html',
  styleUrls: ['./skills.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonButton, IonButtons, IonBackButton]
})
export class SkillsPage implements ViewWillEnter {
  sectorId!: number;
  domain!: string;
  chapterId!: number;
  chapter!: string;

  skills!: Skill[];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService,
              private router: Router) { }

  ionViewWillEnter(): void {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));

    this.message.sendMessage("getSkills", {chapterId: this.chapterId}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.skills = res.data;
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  startMCQ(skillId: number) {
    this.router.navigate(["study"], {queryParams: {
      sectorId: this.sectorId,
      skillId: skillId
    }})
  }

}
