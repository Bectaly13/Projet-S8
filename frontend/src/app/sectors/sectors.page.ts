import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonButton, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

export interface Sector {
  sectorId: number;
  name: string;
}

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.page.html',
  styleUrls: ['./sectors.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonButton]
})
export class SectorsPage implements ViewWillEnter {
  sectors!: Sector[];

  constructor(private message: MessageService,
              private error: ErrorService,
              private router: Router) { }

  ionViewWillEnter() {
    this.message.sendMessage("getSectors", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.sectors = res.data;
      }
      else {
        console.log(this.error.errorMessage(res));
      }
    })
  }

  goToDomains(index: number, sector: string) {
    this.router.navigate(["domains"], {queryParams: {
      sectorId: index,
      sector: sector
    }});
  }

}
