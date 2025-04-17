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
  label: string = "placeholder";

  constructor(private message: MessageService,
              private error: ErrorService) { }

  ngOnInit() {
    this.message.sendMessage("test", {numero: 1}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.label = res.data[0]["name"];
      }
      else {
        this.label = this.error.errorMessage(res);
      }
    })
  }

}
