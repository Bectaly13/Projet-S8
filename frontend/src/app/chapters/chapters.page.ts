import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonList, IonItem, IonButton, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';

export interface Chapter {
  chapterId: number;
  name: string;
  isRelevant: boolean
}

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonButton, IonButtons, IonBackButton]
})
export class ChaptersPage implements ViewWillEnter {
  sectorId!: number;
  sector!: string;
  domainId!: number;
  domain!: string;

  mcqSize!: number;

  domainsImageUrl!: string;
  domainsImageName!: string;

  chapters!: Chapter[];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService,
              private router: Router,
              private variables: SharedVariablesService) { }

  ionViewWillEnter(): void {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));

    this.mcqSize = this.variables.mcqSize;
    this.domainsImageUrl = this.variables.domainsImageUrl;

    this.domainsImageName = this.domainsImageUrl + "domains" + this.domainId + ".jpg";

    this.message.sendMessage("getChapters", {domainId: this.domainId}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.chapters = res.data.map(
          (item: Chapter) => ({
            chapterId : item.chapterId,
            name: item.name.split(") ")[1] ?? item.name
          })
        )

        for(let chapter of this.chapters) {
          this.message.sendMessage("isChapterRelevant", {chapterId: chapter.chapterId, sectorId: this.sectorId, mcqSize: this.mcqSize}).subscribe(res => {
            chapter.isRelevant = res.data;
          })
        }
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  goToMCQ(index: number, chapter: string) {
    this.router.navigate(['/start-mcq'], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector,
      domain: this.domain,
      domainId: this.domainId,
      chapterId: index,
      chapter: chapter,
    }});
  }
}
