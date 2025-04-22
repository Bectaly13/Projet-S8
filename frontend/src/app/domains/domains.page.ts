import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonList, IonItem, IonButton, IonFooter } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

import { NavbarComponent } from '../navbar/navbar.component';

export interface Domain {
  domainId: number;
  name: string;
  imageName: string;
}

@Component({
  selector: 'app-domains',
  templateUrl: './domains.page.html',
  styleUrls: ['./domains.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonButton, IonFooter, NavbarComponent]
})
export class DomainsPage implements ViewWillEnter {
  sectorId!: number;
  sector!: string;

  domains!: Domain[];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService,
              private router: Router) { }

  ionViewWillEnter() {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));

    this.message.sendMessage("getDomains", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.domains = res.data;
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  goToChapters(index: number, domain: string, imageName: string) {
    this.router.navigate(["chapters"], {queryParams: {
      domainId: index,
      domain: domain,
      sectorId: this.sectorId,
      imageName: imageName
    }});
  }

  goToSectors() {
    this.router.navigate(["sectors"]);
  }



  // Fonctions pour les styles css

  takeBgColor(domainId: number): string {
    const index = domainId % 23 || 1;
    return `--ion-color-color${index}`;
  }


  /*
  showFadeTop = false;
  showFadeBottom = true;
  onScroll(event: CustomEvent) {
    const scrollTop = event.detail.scrollTop;
    const scrollHeight = event.detail.scrollHeight;
    const clientHeight = event.detail.offsetHeight;
    this.showFadeTop = scrollTop > 10;
    this.showFadeBottom = scrollTop + clientHeight < scrollHeight - 10;
    console.log('scroll', { scrollTop, scrollHeight, clientHeight });
    console.log('fades', { top: this.showFadeTop, bottom: this.showFadeBottom });
  }
  */
}
