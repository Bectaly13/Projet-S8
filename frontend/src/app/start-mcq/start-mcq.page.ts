import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButtons, IonBackButton, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';

@Component({
  selector: 'app-start-mcq',
  templateUrl: './start-mcq.page.html',
  styleUrls: ['./start-mcq.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonButton]
})
export class StartMCQPage implements ViewWillEnter {
  sectorId!: number;
  sector!: string;
  domain!: string;
  domainId!: number;
  chapterId!: number;
  chapter!: string;
  domainsImageUrl!: string;
  domainsImageName!: string;

  mcqSize!: number;

  areSkillsRelevant!: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private message: MessageService,
              private error: ErrorService,
              private variables: SharedVariablesService) { }

  ionViewWillEnter(): void {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));

    this.domainsImageName = this.domainsImageUrl + "domains" + this.domainId + ".jpg";

    this.mcqSize = this.variables.mcqSize;
    this.domainsImageUrl = this.variables.domainsImageUrl;

    this.message.sendMessage("areSkillsRelevant", {chapterId: this.chapterId, sectorId: this.sectorId, mcqSize: this.mcqSize}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.areSkillsRelevant = res.data;
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  startMCQ() {
    this.router.navigate(["mcq"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector,
      domain: this.domain,
      domainId: this.domainId,
      chapterId: this.chapterId,
      chapter: this.chapter,
    }})
  }

  goToSkills() {
    this.router.navigate(["skills"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector,
      domain: this.domain,
      domainId: this.domainId,
      chapterId: this.chapterId,
      chapter: this.chapter,
    }})
  }
}
