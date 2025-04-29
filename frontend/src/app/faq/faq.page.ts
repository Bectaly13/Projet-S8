import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { DarkModeService } from '../services/dark-mode.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, FormsModule, NavbarComponent]
})
export class FaqPage implements ViewWillEnter {
  questionCount: number = 0;

  constructor(private message: MessageService,
              private error: ErrorService,
              private darkmode: DarkModeService) { }

  ionViewWillEnter(): void {
    this.darkmode.init();

    this.message.sendMessage("getQuestionCount", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.questionCount = res.data[0]["COUNT(questionId)"];
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }
}
