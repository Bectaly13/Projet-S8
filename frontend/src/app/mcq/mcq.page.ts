import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButtons, IonBackButton, IonCheckbox, IonButton, ViewDidEnter, IonProgressBar } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';

declare global {
  interface Window {
    MathJax: any;
  }
}

export interface Question {
  questionId: number;
  explanation: string;
  level: 1 | 2 | 3 | 4;
  mixingType: "RANDOM" | "TWO_BY_TWO" | "FIXED";
}

@Component({
  selector: 'app-mcq',
  templateUrl: './mcq.page.html',
  styleUrls: ['./mcq.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonCheckbox, IonButton, IonProgressBar]
})
export class MCQPage implements ViewWillEnter, ViewDidEnter {
  title!: string;
  backendFileName!: string;
  data!: any;

  mail: string = "appli.qmax@gmail.com";
  choiceLabels: string[] = ["A", "B", "C", "D"];
  color: string = "#00E600";

  sectorId!: number;
  sector!: string;
  domain!: string;
  chapterId!: number;
  chapter!: string;
  imageName!: string;
  skillId!: number;

  mcqSize: number = 5;
  questionIndex: number = 1;
  showAnswer: boolean = false;
  toggledChoices: Boolean[] = [false, false, false, false];
  solution: string = "";
  answerStatus: string = "correcte";
  score!: number;

  validQuestions!: Question[];
  questions!: Question[];

  choices: any[] = [];

  images: any[] = [];

  constructor(private route: ActivatedRoute,
              private message: MessageService,
              private error: ErrorService,
              private router: Router) { }   
  
  ionViewDidEnter(): void {
      this.renderMath();
  }

  ionViewWillEnter(): void {
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));
    this.imageName = String(this.route.snapshot.queryParamMap.get("imageName"));
    this.skillId = Number(this.route.snapshot.queryParamMap.get("skillId"));

    this.score = 0;

    if(this.skillId) {
      this.title = "J'apprends";
      this.backendFileName = "getValidLearnQuestions";
      this.data = {sectorId: this.sectorId, skillId: this.skillId, mcqSize : this.mcqSize};
    }

    else if(this.chapterId) {
      this.title = "Je révise";
      this.backendFileName = "getValidStudyQuestions";
      this.data = {sectorId: this.sectorId, chapterId: this.chapterId, mcqSize : this.mcqSize};
    }

    else {
      console.error("Error : no study mode given");
    }

    this.message.sendMessage(this.backendFileName, this.data).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.validQuestions = res.data;

        this.questions = [...this.validQuestions].sort(() => Math.random() - 0.5).slice(0, this.mcqSize).sort((a, b) => a.level - b.level);

        for(let i = 0; i<this.questions.length; i++) {
          this.getQuestionChoices(i);
        };

        for(let i = 0; i<this.questions.length; i++) {
          this.getQuestionImages(i);
        };
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  getQuestionChoices(i: number) {
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
  }

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  getQuestionImages(i: number) {
    this.message.sendMessage("getQuestionImages", {questionId: this.questions[i].questionId}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.images[i] = res.data;
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }
  
  parseText(text: string): string {
    return text.replace(/url\((.*?)\)/g, (match, fileName) => {
      const file = fileName.trim();
      const url = "assets/questions/";

      return `<br><img src="${url}${file}" class="question-image"/><br>`;
    });
  }

  renderMath() {
    setTimeout(() => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetClear?.();
        window.MathJax.typesetPromise()
          .then(() => {})
          .catch((err: any) => console.error('Erreur MathJax :', err));
      } else {
        console.warn('MathJax non chargé');
      } 
    }, 0);
  }

  checkAnswer(choices: any) {
    let answers: Boolean[] = [];
    let lastTrueIndex: number = 0;

    for(let i=0; i<choices.length; i++) { // get correct answers
      if(choices[i].isCorrect) {
        answers.push(true);
        lastTrueIndex = i;
      }
      else {
        answers.push(false);
      }
    }

    for(let i=0; i<lastTrueIndex + 1; i++) { // prepare solution string
      if(answers[i]) {
        if(i == lastTrueIndex) {
          this.solution += this.choiceLabels[choices[i].choiceOrder - 1];
        }
        else {
          this.solution += this.choiceLabels[choices[i].choiceOrder - 1] + ", ";
        }
      }
    }

    if(this.solution == "") {
      this.solution = "aucune de ces réponses";
    }

    for(let i=0; i<answers.length; i++) { // update answer status
      if(this.toggledChoices[i] != answers[i]) {
        this.answerStatus = "incorrecte";
        break;
      }
    }

    if(this.answerStatus == "correcte") { // update score
      this.score ++;
    }

    this.showAnswer = true;

    this.renderMath();
  }

  nextQuestion() {
    this.questionIndex ++;
    this.showAnswer = false;
    this.solution = "";
    this.toggledChoices = [false, false, false, false];
    this.answerStatus = "correcte";

    this.renderMath();
  }

  showScore() {
    this.questionIndex = 1;
    this.showAnswer = false;
    this.solution = "";
    this.toggledChoices = [false, false, false, false];
    this.answerStatus = "correcte";

    this.router.navigate(["score"], {queryParams: {
      score: this.score,
      mcqSize: this.mcqSize,
      sectorId: this.sectorId,
      sector: this.sector,
      domain: this.domain,
      chapterId: this.chapterId,
      chapter: this.chapter,
      imageName: this.imageName
    }})
  }
}
