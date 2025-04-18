import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButtons, IonBackButton, IonList, IonItem, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

export interface Domain {
  domainId: number;
  name: string;
}

@Component({
  selector: 'app-domains',
  templateUrl: './domains.page.html',
  styleUrls: ['./domains.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonList, IonItem, IonButton]
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

    this.message.sendMessage("getDomains", {sectorId : this.sectorId}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.domains = res.data.map(
          (item: {domainId: number, name: string}) => ({
            domainId: item.domainId,
            name: item.name
          })
        );
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  goToChapters(index: number) {
    this.router.navigate(["chapters"], {queryParams: {
      domainId: index,
      sectorId: this.sectorId
    }});
  }
}
