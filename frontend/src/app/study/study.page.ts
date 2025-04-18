import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-study',
  templateUrl: './study.page.html',
  styleUrls: ['./study.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton]
})
export class StudyPage implements ViewWillEnter {
  sectorId!: number;
  chapterId!: number;

  mcqSize: number = 5;
  questionIndex: number = 1;

  questionIds!: number[];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService) { }

  ionViewWillEnter(): void {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));

    this.message.sendMessage("getValidStudyQuestions", {sectorId: this.sectorId, chapterId: this.chapterId, mcqSize : this.mcqSize}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {

      }
      else {
        this.error.errorMessage(res);
      }
    })
  }
}
