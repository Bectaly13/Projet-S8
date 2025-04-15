import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  label: string = "placeholder";

  constructor(private message: MessageService) { }

  ngOnInit() {
    this.message.sendMessage("test", {numero: 1}).subscribe(res => {
      console.log(res);
      if(res.status == "ok") {
        this.label = res.data[0]["label"];
      }
      else {
        this.label = "Error";
      }
    })
  }

}
