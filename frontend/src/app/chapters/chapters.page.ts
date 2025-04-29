import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonContent, IonToolbar, ViewWillEnter, IonList, IonItem, IonButton, IonFooter } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';
import { DarkModeService } from '../services/dark-mode.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

export interface Chapter {
  chapterId: number;
  name: string;
}

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
  standalone: true,
  imports: [IonHeader, IonContent, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonButton, IonFooter, HeaderComponent, NavbarComponent]
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
              private variables: SharedVariablesService,
              private darkmode: DarkModeService) { }

  ionViewWillEnter(): void {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));

    this.mcqSize = this.variables.mcqSize.large;
    this.domainsImageUrl = this.variables.domainsImageUrl;

    this.domainsImageName = this.domainsImageUrl + "domains" + this.domainId + ".jpg";

    this.message.sendMessage("getChapters", {domainId: this.domainId, sectorId: this.sectorId, mcqSize: this.mcqSize}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        const sortedData = res.data.sort((a: Chapter, b: Chapter) => {
          const matchA = a.name.match(/^(\d+)\)/);
          const matchB = b.name.match(/^(\d+)\)/);
          const numberA = matchA ? Number(matchA[1]) : 9999;
          const numberB = matchB ? Number(matchB[1]) : 9999;
          return numberA - numberB;
        });
      
        this.chapters = sortedData.map((item: Chapter) => {
          const match = item.name.match(/^\d+\)\s*(.+)/);
          return {
            chapterId: item.chapterId,
            name: match ? match[1] : item.name
          };
        });
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
