import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter, IonList, IonItem, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';
import { DarkModeService } from '../services/dark-mode.service';
import { StorageService } from '../services/storage.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

export interface Skill {
  skillId: number;
  name: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.page.html',
  styleUrls: ['./skills.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, FormsModule, IonList, IonItem, IonButton, NavbarComponent]
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
  skillStats: number[] = [];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService,
              private router: Router,
              private variables: SharedVariablesService,
              private darkmode: DarkModeService,
              private storage: StorageService) { }

  async ionViewWillEnter() {
    this.darkmode.init();
    
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));

    this.domainsImageUrl = this.variables.domainsImageUrl;

    this.domainsImageName = this.domainsImageUrl + "domains" + this.domainId + ".jpg";

    const chapter_data = (await this.storage.get("questions_data"))[this.sectorId][this.domainId][this.chapterId];

    this.message.sendMessage("getSkills", {chapterId: this.chapterId, sectorId: this.sectorId}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.skills = res.data;

        this.message.sendMessage("getSkillQuestions", {chapterId: this.chapterId, sectorId: this.sectorId}).subscribe(res => {
          console.log(res);
          if(res.status == 200) {
            const correctSet = new Set(chapter_data.correct);
            for(let skillId of Object.keys(res.data)) {
              const matchCount = res.data[skillId].filter((q: number) => correctSet.has(q)).length;

              this.skillStats.push(matchCount / res.data[skillId].length * 100);
            }
          }
          else {
            this.error.errorMessage(res);
          }
        })
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
