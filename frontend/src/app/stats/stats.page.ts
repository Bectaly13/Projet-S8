import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { DarkModeService } from '../services/dark-mode.service';
import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';
import { StorageService } from '../services/storage.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

export interface Domain {
  domainId: number;
  name: string;
}

export interface DomainStats {
  correct: number;
  incorrect: number;
  total: number;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, FormsModule, NavbarComponent, IonButton]
})
export class StatsPage implements ViewWillEnter {
  domains: Domain[] = [];
  stats: DomainStats[] = [];

  sectorId!: number;
  sector!: string;
  mcqSize!: number;

  constructor(private darkmode: DarkModeService,
              private message: MessageService,
              private error: ErrorService,
              private variables: SharedVariablesService,
              private route: ActivatedRoute,
              private storage: StorageService,
              private router: Router) { }

  async ionViewWillEnter() {
    this.darkmode.init();

    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));

    this.mcqSize = this.variables.mcqSize.large;

    const sector_data = (await this.storage.get("questions_data"))[this.sectorId];

    this.message.sendMessage("getDomains", {sectorId: this.sectorId, mcqSize: this.mcqSize}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.domains = res.data;

        for(let domain of this.domains) {
          let correct: number = 0;
          let incorrect: number = 0;
          let total: number = 0;

          const domainId = domain["domainId"];
          const domain_data = sector_data[domainId];

          for(let chapterId of Object.keys(domain_data)) {
            const chapter = domain_data[chapterId];
            correct += chapter.correct.length;
            incorrect += chapter.incorrect.length;
            total += chapter.total;
          }

          const stats: DomainStats = {
            correct: correct,
            incorrect: incorrect,
            total: total
          };

          this.stats.push(stats);
        }
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  goToStatsDomain(domainId: number, name: string, index: number) {
    this.router.navigate(["stats-domain"], {queryParams: {
      sectorId: this.sectorId,
      sector: this.sector,
      domainId: domainId,
      domain: name,
      correct: this.stats[index].correct,
      incorrect: this.stats[index].incorrect,
      total: this.stats[index].total
    }})
  }
}
