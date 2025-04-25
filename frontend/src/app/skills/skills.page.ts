import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonList, IonItem, IonButton, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';

export interface Skill {
  skillId: number;
  name: string;
  isRelevant: boolean
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
  sector!: string;
  domain!: string;
  domainId!: number;
  chapterId!: number;
  chapter!: string;

  domainsImageUrl!: string;
  domainsImageName!: string;

  skills!: Skill[];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService,
              private router: Router,
              private variables: SharedVariablesService) { }

  ionViewWillEnter(): void {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));

    this.domainsImageUrl = this.variables.domainsImageUrl;

    this.domainsImageName = this.domainsImageUrl + "domains" + this.domainId + ".jpg";

    this.message.sendMessage("getSkills", {chapterId: this.chapterId}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.skills = res.data;

        for(let skill of this.skills) {
          this.message.sendMessage("isSkillRelevant", {skillId: skill.skillId, sectorId: this.sectorId}).subscribe(res => {
            skill.isRelevant = res.data;
          })
        }
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  startMCQ(skillId: number) {
    this.router.navigate(["mcq"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector,
      domain: this.domain,
      domainId: this.domainId,
      chapterId: this.chapterId,
      chapter: this.chapter,
      skillId: skillId
    }})
  }

}
