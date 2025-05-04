import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

import { DarkModeService } from '../services/dark-mode.service';
import { StorageService } from '../services/storage.service';
import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';

export interface Chapter {
  chapterId: number;
  name: string;
}

export interface ChapterStats {
  correct: number;
  incorrect: number;
  unseen: number;
}

@Component({
  selector: 'app-stats-domain',
  templateUrl: './stats-domain.page.html',
  styleUrls: ['./stats-domain.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, NavbarComponent, DoughnutChartComponent, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class StatsDomainPage implements ViewWillEnter {
  chapters: Chapter[] = [];
  stats: ChapterStats[] = [];

  sectorId!: number;
  sector!: string;
  domainId!: number;
  domain!: string;
  correct!: number;
  incorrect!: number;
  unseen!: number;

  constructor(private darkmode: DarkModeService,
              private route: ActivatedRoute,
              private storage: StorageService,
              private message: MessageService,
              private error: ErrorService,
              private variables: SharedVariablesService) { }

  ionViewWillEnter() {
    this.getDomainStats();
  }

  async getDomainStats() {
    this.darkmode.init();

    this.chapters = [];
    this.stats = [];

    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.correct = Number(this.route.snapshot.queryParamMap.get("correct"));
    this.incorrect = Number(this.route.snapshot.queryParamMap.get("incorrect"));
    this.unseen = Number(this.route.snapshot.queryParamMap.get("unseen"));

    const mcqSize = this.variables.mcqSize.large;

    const domain_data = (await this.storage.get("questions_data"))[this.sectorId][this.domainId];

    this.message.sendMessage("getChapters", {domainId: this.domainId, sectorId: this.sectorId, mcqSize: mcqSize}).subscribe(res => {
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
    
        for(let chapter of this.chapters) {
          const chapterId = chapter["chapterId"];
          const chapter_data = domain_data[chapterId];

          let correct:number = chapter_data.correct.length;
          let incorrect:number = chapter_data.incorrect.length;
          let unseen:number = chapter_data.unseen.length;

          const stats: ChapterStats = {
            correct: correct,
            incorrect: incorrect,
            unseen: unseen
          };
    
          this.stats.push(stats);
        }
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }
}
