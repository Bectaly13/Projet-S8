import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedVariablesService } from '../services/shared-variables.service';
import { DarkModeService } from '../services/dark-mode.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-start-mcq',
  templateUrl: './start-mcq.page.html',
  styleUrls: ['./start-mcq.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, FormsModule, IonButton, NavbarComponent]
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private variables: SharedVariablesService,
              private darkmode: DarkModeService) { }

  ionViewWillEnter(): void {
    this.darkmode.init(); // récupération des préférences relatives au thème sombre

    // récupération des variables transmises par la page parent
    
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));

    this.mcqSize = this.variables.mcqSize;
    this.domainsImageUrl = this.variables.domainsImageUrl;

    this.domainsImageName = this.domainsImageUrl + "domains" + this.domainId + ".jpg";
  }

  startMCQ() {
    // on commence le QCM pour le chapitre choisi
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
    // on dirige l'utilisateur vers la page de sélection des compétences pour le chapitre choisi
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
