import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  domainName: string = "";
  domainInput: string = "";

  constructor(private message: MessageService,
              private error: ErrorService) { }

  ngOnInit() {

  }

  getDomainName() {
    this.message.sendMessage("getDomainName", {numero: this.domainInput}).subscribe(res => {
      if(res.status == 200) {
        this.domainName = res.data[0]["name"];
      }
      else {
        this.domainName = "";
        console.log(this.error.errorMessage(res));
      }
    })
  }

}
