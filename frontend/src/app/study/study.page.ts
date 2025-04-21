import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

export interface Question {
  questionId: number;
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
        this.validQuestions = res.data;

        this.questions = [...this.validQuestions].sort(() => Math.random() - 0.5).slice(0, this.mcqSize).sort((a, b) => a.level - b.level);

        for(let i = 0; i<this.questions.length; i++) {
          this.message.sendMessage("getQuestionChoices", {questionId: this.questions[i].questionId}).subscribe(res => {
            console.log(res);
            if(res.status == 200) {
              this.choices[i] = res.data;

              const mixingType = this.questions[i].mixingType;

              if (mixingType === "RANDOM") {
                const fieldsToShuffle = this.choices[i].map((c: any) => ({
                  choiceText: c.choiceText,
                  isCorrect: c.isCorrect
                }));
                const shuffled: any[] = this.shuffle(fieldsToShuffle);
                for (let j = 0; j < this.choices[i].length; j++) {
                  this.choices[i][j].choiceText = shuffled[j].choiceText;
                  this.choices[i][j].isCorrect = shuffled[j].isCorrect;
                }
              }

              else if (mixingType === "TWO_BY_TWO") {
                const group1 = this.choices[i].slice(0, 2).map((c: any) => ({
                  choiceText: c.choiceText,
                  isCorrect: c.isCorrect
                }));
                const group2 = this.choices[i].length > 2 ? this.choices[i].slice(2, 4).map((c: any) => ({
                  choiceText: c.choiceText,
                  isCorrect: c.isCorrect
                })) : [];

                const shuffled1: any[] = this.shuffle(group1);
                const shuffled2: any[] = this.shuffle(group2);

                for (let j = 0; j < shuffled1.length; j++) {
                  this.choices[i][j].choiceText = shuffled1[j].choiceText;
                  this.choices[i][j].isCorrect = shuffled1[j].isCorrect;
                }
                for (let j = 0; j < shuffled2.length; j++) {
                  this.choices[i][j + 2].choiceText = shuffled2[j].choiceText;
                  this.choices[i][j + 2].isCorrect = shuffled2[j].isCorrect;
                }
              }
            }
            else {
              this.error.errorMessage(res);
            }
          })
        };

        for(let i = 0; i<this.questions.length; i++) {
          this.message.sendMessage("getQuestionImages", {questionId: this.questions[i].questionId}).subscribe(res => {
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

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  } 
}
