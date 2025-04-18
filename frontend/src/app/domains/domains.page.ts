import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.page.html',
  styleUrls: ['./domains.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton]
})
export class DomainsPage implements ViewWillEnter {
  sectorId!: number;
  sector!: string;

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService) { }

  ionViewWillEnter() {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));

    this.message.sendMessage("getSectorName", {sectorId: this.sectorId}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.sector = res.data[0]["name"];
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

}
