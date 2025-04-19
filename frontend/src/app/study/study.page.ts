import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

export interface Question {
  questionId: number;
  questionGroupId: number;
  explanation: string;
  level: 1 | 2 | 3 | 4;
  mixingType: "RANDOM" | "TWO_BY_TWO" | "FIXED";
}

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

  validQuestions!: Question[];
  questions!: Question[];
  questionIds!: number[];

  choices: any[] = [];

  images: any[] = [];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService) { }

  ionViewWillEnter(): void {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));

    this.message.sendMessage("getValidStudyQuestions", {sectorId: this.sectorId, chapterId: this.chapterId, mcqSize : this.mcqSize}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.validQuestions = res.data.map(
          (item : Question) => ({
            questionId: item.questionId,
            questionGroupId: item.questionGroupId,
            explanation: item.explanation,
            level: item.level,
            mixingType: item.mixingType
          })
        );

        this.questions = [...this.validQuestions].sort(() => Math.random() - 0.5).slice(0, this.mcqSize).sort((a, b) => a.level - b.level);

        this.questionIds = this.questions.map(q => q.questionId);

        for(let i = 0; i<this.questions.length; i++) {
          this.message.sendMessage("getQuestionChoices", {questionId: this.questions[i]["questionId"]}).subscribe(res => {
            console.log(res);
            if(res.status == 200) {
              this.choices[i] = res.data;
            }
            else {
              this.error.errorMessage(res);
            }
          })
        };

        for(let i = 0; i<this.questions.length; i++) {
          this.message.sendMessage("getQuestionImages", {questionId: this.questions[i]["questionId"]}).subscribe(res => {
            console.log(res);
            if(res.status == 200) {
              this.images[i] = res.data;
            }
            else {
              this.error.errorMessage(res);
            }
          })
        };
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }
}
