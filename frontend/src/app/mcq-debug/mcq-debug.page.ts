import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonCheckbox, IonButton, ViewDidEnter, AlertController, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { SharedVariablesService } from '../services/shared-variables.service';
import { DarkModeService } from '../services/dark-mode.service';
import { StorageService } from '../services/storage.service';
import { UpdateQuestionsDataService } from '../services/update-questions-data.service';

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

export interface typedString {
  data: string;
  type: "TEXT" | "LATEX" | "IMAGE";
}

export interface typedChoice {
  choiceOrder: string;
  wordingBefore: typedString[];
  choiceText: typedString[];
  wordingAfter: typedString[];
}

@Component({
  selector: 'app-mcq-debug',
  templateUrl: './mcq-debug.page.html',
  styleUrls: ['./mcq-debug.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonCheckbox, IonInput]
})
export class McqDebugPage implements ViewWillEnter, ViewDidEnter {
  title!: string;
  backendFileName!: string;
  data!: any;

  mail!: string;
  choiceLabels!: string[];

  sectorId!: number;
  sector!: string;
  domain!: string;
  domainId!: number;
  chapterId!: number;
  chapter!: string;
  skillId!: number;
  skill!: string;

  mcqSize!: number;
  questionIndex: number = 1;
  showAnswer: boolean = false;
  toggledChoices: Boolean[] = [false, false, false, false];
  solution: string = "";
  answerStatus: string = "correcte";
  score!: number;

  questions!: Question[];
  typedExplanations: any[] = [];

  choices: any[] = [];
  typedChoices: any[] = [];

  images: any[] = [];
  questionImagesUrl!: string;

  mcq_data!: any;

  constructor(private message: MessageService,
              private error: ErrorService,
              private router: Router,
              private variables: SharedVariablesService,
              private alert: AlertController,
              private darkmode: DarkModeService,
              private storage: StorageService,
              private update: UpdateQuestionsDataService) { }   
  
  ionViewDidEnter(): void {
      this.renderMath();
  }

  async ionViewWillEnter() {
    this.darkmode.init();
    
    this.choiceLabels = this.variables.choiceLabels;
    this.questionImagesUrl = this.variables.questionImagesUrl;

    this.message.sendMessage("getAllQuestions", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        let selectedQuestions = res.data;

        this.mcqSize = res.data.length;

        // we sort questions by questionId
        this.questions = selectedQuestions.sort((a: any, b: any) => a.questionId - b.questionId);

        // we get all the questionIds and use it to fetch images and choices
        const questionIds = this.questions.map(q => q.questionId);

        this.getImages(questionIds);
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }

  parseTypedString(text: string): typedString[] {
    const result: typedString[] = [];
    let currentIndex = 0;
  
    const regex = /\$.*?\$|url\(.*?\)/g;
    let match;
  
    while ((match = regex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index);
        result.push({
          data: beforeText,
          type: "TEXT"});
      }
  
      const matchedText = match[0];
  
      if (matchedText.startsWith('$') && matchedText.endsWith('$')) {
        result.push({
          data: matchedText,
          type: "LATEX"});
      }
      else if (matchedText.startsWith('url(') && matchedText.endsWith(')')) {
        const originalFileName = matchedText.slice(4, -1).trim();
        let foundPath = "";

        for(let imageSet of this.images) {
          for(let image of imageSet) {
            if(image.originalFileName == originalFileName) {
              foundPath = this.questionImagesUrl + image.path;
              break;
            }
          }

          if(foundPath) {
            break;
          }
        }

        result.push({
          data: foundPath,
          type: "IMAGE"});
      }
  
      currentIndex = regex.lastIndex;
    }
  
    if (currentIndex < text.length) {
      const afterText = text.slice(currentIndex);
      result.push({
        data: afterText,
        type: "TEXT"});
    }
  
    return result;
  }

  getChoices(questionIds: number[], callback?: () => void) {
    this.message.sendMessage("getChoices", {questionIds: questionIds}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        for (let i = 0; i < this.questions.length; i++) {
          const questionId = this.questions[i].questionId;
          const choicesForQuestion = res.data[questionId] || [];
          this.choices[i] = choicesForQuestion;
  
          const mixingType = this.questions[i].mixingType;
  
          if (mixingType == "RANDOM") {
            const fieldsToShuffle = this.choices[i].map((c: any) => ({
              choiceText: c.choiceText,
              isCorrect: c.isCorrect
            }));
            const shuffled: any[] = this.shuffle(fieldsToShuffle);
            for (let j = 0; j < this.choices[i].length; j++) {
              this.choices[i][j].choiceText = shuffled[j].choiceText;
              this.choices[i][j].isCorrect = shuffled[j].isCorrect;
            }
          } else if (mixingType == "TWO_BY_TWO") {
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
  
        if (callback) {
          callback();
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

  getImages(questionIds: number[]) {
    this.message.sendMessage("getImages", {questionIds: questionIds}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        for (let i = 0; i < this.questions.length; i++) {
          const questionId = this.questions[i].questionId;
          this.images[i] = res.data[questionId] || [];
        }

        this.typedExplanations = this.questions.map(question => {
          const explanation = question.explanation;
          return this.parseTypedString(explanation);
        });

        this.getChoices(questionIds, () => {
          this.typedChoices = this.choices.map(choiceGroup =>
            choiceGroup.map((choice: any) => ({
              choiceOrder: choice.choiceOrder,
              wordingBefore: this.parseTypedString(choice.wordingBefore),
              choiceText: this.parseTypedString(choice.choiceText),
              wordingAfter: this.parseTypedString(choice.wordingAfter)
            }))
          );
        });
      } 
      else {
        this.error.errorMessage(res);
      }
    })
  }

  renderMath() {
    setTimeout(() => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetClear?.();
        window.MathJax.typesetPromise()
          .then(() => {})
          .catch((err: any) => console.error("MathJax error:", err));
      } else {
        console.warn("MathJax not loaded");
      } 
    }, 0);
  }

  checkAnswer(choices: any, questionId: number) {
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

    // edit mcq_data
    this.mcq_data.correct = this.mcq_data.correct.filter((qId: any) => (qId != questionId));
    this.mcq_data.incorrect = this.mcq_data.incorrect.filter((qId: any) => (qId != questionId));
    this.mcq_data.unseen = this.mcq_data.unseen.filter((qId: any) => (qId != questionId));

    if(this.answerStatus == "correcte") {
      this.mcq_data.correct.push(questionId);
    }
    else {
      this.mcq_data.incorrect.push(questionId);
    }

    this.renderMath();
  }

  async goBack() {
    const alert = await this.alert.create({
      header: "Quitter le QCM ?",
      message: "Tous les progrès seront perdus.",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
        },
        {
          text: "Quitter",
          handler: () => {
            history.back();
          },
        },
      ],
    });

    await alert.present();
  }

  nextQuestion() {
    this.questionIndex ++;
    this.showAnswer = false;
    this.solution = "";
    this.toggledChoices = [false, false, false, false];
    this.answerStatus = "correcte";

    this.renderMath();
  }

  async showScore() {
    let questions_data = (await this.storage.get("questions_data"));
    questions_data[this.sectorId][this.domainId][this.chapterId] = this.mcq_data;
    this.storage.set("questions_data", questions_data);

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
      domainId: this.domainId,
      chapterId: this.chapterId,
      chapter: this.chapter
    }})
  }

  shouldHaveRoundedBottom(index: number, choice: any): boolean {
    const currentChoice = this.typedChoices[this.questionIndex - 1][index];
    const nextChoice = this.typedChoices[this.questionIndex - 1][index + 1];
  
    const hasWordingAfter = currentChoice.wordingAfter && currentChoice.wordingAfter.length > 0;
    const isLastChoice = index === this.typedChoices[this.questionIndex - 1].length - 1;
    const nextHasWordingBefore = nextChoice && nextChoice.wordingBefore && nextChoice.wordingBefore.length > 0;
  
    return !hasWordingAfter && (isLastChoice || nextHasWordingBefore);
  }

  next() {
    this.questionIndex++;
    this.renderMath();
  }

  prev() {
    this.questionIndex--;
    this.renderMath();
  }

  debug() {
    console.log("this.choices", this.choices);
    console.log("this.typedChoices", this.typedChoices);
    console.log("this.questions", this.questions);
    console.log("this.typedExplanations", this.typedExplanations);
    console.log("this.images", this.images);
  }
}