import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton, IonList, IonItem, AlertController } from '@ionic/angular/standalone';

import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFooter, NavbarComponent, IonButton, IonList, IonItem]
})
export class FaqPage {
  mail: string = "appli.qmax@gmail.com";
  subject: string = "Demande d'information";

  headers: string[] = [
    "titre 1",
    "titre 2"
  ]

  messages: string[] = [
    "texte 1",
    "texte 2"
  ]

  constructor(private alert: AlertController) { }

  openText(index: number) {
    const header = this.headers[index];
    const message = this.messages[index];
    this.alert.create({
      header: header,
      message: message,
      buttons: ['OK']
    }).then((alert) => {
      alert.present();
      alert.onDidDismiss();
    })
  }

}
