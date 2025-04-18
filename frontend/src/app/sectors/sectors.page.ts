import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonButton } from '@ionic/angular/standalone';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.page.html',
  styleUrls: ['./sectors.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonButton]
})
export class SectorsPage implements OnInit {
  sectors: string[] = [];

  constructor(private message: MessageService,
              private error: ErrorService) { }

  ngOnInit() {
    this.message.sendMessage("getSectors", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.sectors = res.data.map(
          (item: { name: string }) => item.name
        );
      }
      else {
        console.log(this.error.errorMessage(res));
      }
    })
  }

}
