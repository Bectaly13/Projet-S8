import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewWillEnter, IonButtons, IonCheckbox, IonButton, ViewDidEnter, IonProgressBar, AlertController, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-mcq',
  templateUrl: './mcq.page.html',
  styleUrls: ['./mcq.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonCheckbox, IonButton, IonProgressBar, IonIcon]
})
export class MCQPage implements ViewWillEnter, ViewDidEnter {
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

  constructor(private route: ActivatedRoute,
              private message: MessageService,
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
    this.darkmode.init(); // récupération des préférences relatives au thème sombre

    // récupération des variables transmises par la page parent
    
    this.sectorId = Number(this.route.snapshot.queryParamMap.get("sectorId"));
    this.sector = String(this.route.snapshot.queryParamMap.get("sector"));
    this.domain = String(this.route.snapshot.queryParamMap.get("domain"));
    this.domainId = Number(this.route.snapshot.queryParamMap.get("domainId"));
    this.chapterId = Number(this.route.snapshot.queryParamMap.get("chapterId"));
    this.chapter = String(this.route.snapshot.queryParamMap.get("chapter"));
    this.skillId = Number(this.route.snapshot.queryParamMap.get("skillId"));
    this.skill = String(this.route.snapshot.queryParamMap.get("skill"));

    this.update.updateQuestionsData(this.sectorId); // on remet à jour les questions disponibles pour la filière de l'utilisateur.

    this.mcq_data = (await this.storage.get("questions_data"))[this.sectorId][this.domainId][this.chapterId];

    this.score = 0; // on initialise le score à 0

    // on récupère des variables globales
    this.mail = this.variables.mail;
    this.choiceLabels = this.variables.choiceLabels;
    this.questionImagesUrl = this.variables.questionImagesUrl;

    if(this.skillId) { // si un skillId est donné, c'est que l'on est en mode J'apprends
      this.title = "J'apprends";
      this.backendFileName = "getValidLearnQuestions";
      this.mcqSize = this.variables.mcqSize.small;
      this.data = {sectorId: this.sectorId, skillId: this.skillId};
    }

    else if(this.chapterId) { // sinon, si un chapterId est donné, c'est que l'on est en mode Je révise
      this.title = "Je révise";
      this.backendFileName = "getValidStudyQuestions";
      this.mcqSize = this.variables.mcqSize.large;
      this.data = {sectorId: this.sectorId, chapterId: this.chapterId, mcqSize : this.mcqSize};
    }

    else { // ce cas ne devrait jamais ce produire, mais une erreur console est prévue.
      console.error("Error : no study mode given");
    }

    // en fonction du mode de révision, on va interroger le serveur pour récupérer des questions adéquates.
    this.message.sendMessage(this.backendFileName, this.data).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        const question_groups = res.data;

        // on récupère tous les questionGroupIds pertinents.
        const groupIds = Object.keys(question_groups);

        // cette méthode permet de sélectionner une question aléatoire dans un question_group.
        function pickRandomQuestion(questions: Question[]): Question {
          const index = Math.floor(Math.random() * questions.length);
          return questions[index];
        }

        // on prépare quelques structures
        const selectedQuestions: Question[] = [];
        const usedGroupIds = new Set<string>();

        // on utilise une hiérarchie pour récupérer les questions.
        // d'abord les questions jamais traitées (unseen), puis les questions dernièrement mal répondues
        // (incorrect), et enfin les question dernièrement bien répondues (correct).
        const unseenGroups: string[] = [];
        const incorrectGroups: string[] = [];
        const correctGroups: string[] = [];

        for(const groupId of groupIds) {
          const questions = question_groups[groupId];
          const hasUnseen = questions.some((q: Question) => this.mcq_data.unseen.includes(q.questionId));
          const hasIncorrect = questions.some((q: Question) => this.mcq_data.incorrect.includes(q.questionId));
          const hasCorrect = questions.some((q: Question) => this.mcq_data.correct.includes(q.questionId));

          if(hasUnseen) unseenGroups.push(groupId);
          else if(hasIncorrect) incorrectGroups.push(groupId);
          else if(hasCorrect) correctGroups.push(groupId);
        }

        // pour ajouter de l'aléatoire à chaque QCM, cette méthode permet de mélanger les questions.
        function shuffle<T>(array: T[]): T[] {
          return array
            .map(value => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value);
        }

        // on mélange donc chaque catégorie.
        const shuffledUnseenGroups = shuffle(unseenGroups);
        const shuffledIncorrectGroups = shuffle(incorrectGroups);
        const shuffledCorrectGroups = shuffle(correctGroups);
       

        // étape 1 : on récupère des questions unseen.
        for(const groupId of shuffledUnseenGroups) {
          if(selectedQuestions.length >= this.mcqSize) break;
          const questions = question_groups[groupId];
          const unseenQs = questions.filter((q: Question) => this.mcq_data.unseen.includes(q.questionId));
          if(unseenQs.length > 0) {
            selectedQuestions.push(pickRandomQuestion(unseenQs));
            usedGroupIds.add(groupId);
          }
        }

        // étape 2 : si on n'a pas assez d'unseen, on pioche parmi les incorrect et les correct.
        // idéalement, on récupère 60% d'incorrect et 40% de correct.
        let remaining = this.mcqSize - selectedQuestions.length;

        if(remaining > 0) {
          let numIncorrect = Math.ceil(remaining * 0.6);
          let numCorrect = remaining - numIncorrect;

          const availableIncorrect = shuffledIncorrectGroups.filter(gid => !usedGroupIds.has(gid));
          const availableCorrect = shuffledCorrectGroups.filter(gid => !usedGroupIds.has(gid));

          // si on n'a pas assez de groupes disponibles...
          if(availableIncorrect.length < numIncorrect) {
            numCorrect += numIncorrect - availableIncorrect.length;
            numIncorrect = availableIncorrect.length;
          }
          if(availableCorrect.length < numCorrect) {
            numIncorrect += numCorrect - availableCorrect.length;
            numCorrect = availableCorrect.length;
          }

          // ...on ajoute des incorrect
          for(const groupId of availableIncorrect) {
            if(numIncorrect <= 0 || selectedQuestions.length >= this.mcqSize) break;
            const questions = question_groups[groupId];
            const incorrectQs = questions.filter((q: Question) => this.mcq_data.incorrect.includes(q.questionId));
            if(incorrectQs.length > 0) {
              selectedQuestions.push(pickRandomQuestion(incorrectQs));
              usedGroupIds.add(groupId);
              numIncorrect--;
            }
          }

          // ...puis on ajoute des correct
          for(const groupId of availableCorrect) {
            if(numCorrect <= 0 || selectedQuestions.length >= this.mcqSize) break;
            const questions = question_groups[groupId];
            const correctQs = questions.filter((q: Question) => this.mcq_data.correct.includes(q.questionId));
            if(correctQs.length > 0) {
              selectedQuestions.push(pickRandomQuestion(correctQs));
              usedGroupIds.add(groupId);
              numCorrect--;
            }
          }
        }

        // en mode J'apprends, on peut avoir besoin d'ajuster la taille du QCM (qui peut être inférieure à this.variables.mcqSize.small)
        if(this.title == "J'apprends") {
          this.mcqSize = selectedQuestions.length;
        }

        // on trie les questions sélectionnées par difficulté
        this.questions = selectedQuestions.sort((a, b) => a.level - b.level);

        // on récupère les questionIds
        const questionIds = this.questions.map(q => q.questionId);

        // on se sert des questionIds pour récupérer les images et autres informations relatives aux questions
        this.getImages(questionIds);
      }
      else {
        this.questions = [];
        this.typedChoices = [];
        this.choices = [];
        this.images = [];
        this.typedExplanations = [];
        this.error.errorMessage(res);
      }
    })
  }

  parseTypedString(text: string): typedString[] {
    // cette méthode permet de scanner les textes dans les questions, afin de les découper en trois catégories :
    // TEXT : texte normal
    // LATEX : texte à interprété en LaTeX, délimimté par $ et $
    // IMAGE : texte à remplacer par une image, de la forme url(...)
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
    // on récupère les choix relatifs à une liste de questionId
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
    // cette méthode permet d'ajouter de l'aléatoire dans l'ordre des choix des questions (si nécessaire)
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  getImages(questionIds: number[]) {
    // cette méthode permet de récupérer les images pour les questions.
    // elle appelle également this.getChoices() et this.parseTypedStrgin()
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
    // cette méthode permet de faire le rendu LaTeX
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
    // cette méthode permet de vérifier si la réponse fournie est la bonne
    let answers: Boolean[] = [];
    let lastTrueIndex: number = 0;

    for(let i=0; i<choices.length; i++) { // on récupère la bonne réponse
      if(choices[i].isCorrect) {
        answers.push(true);
        lastTrueIndex = i;
      }
      else {
        answers.push(false);
      }
    }

    for(let i=0; i<lastTrueIndex + 1; i++) { // on crée la chaîne de caractère contenant la bonne réponse
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

    for(let i=0; i<answers.length; i++) { // on met à jour le statut de la réponse
      if(this.toggledChoices[i] != answers[i]) {
        this.answerStatus = "incorrecte";
        break;
      }
    }

    if(this.answerStatus == "correcte") { // on met à jour le score
      this.score ++;
    }

    this.showAnswer = true;

    // on met à jour mcq_data
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
    // si l'utilisateur souhaite quitter le QCM, une alerte le prévient que son progrès ne sera pas sauvegardé
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
    // on passe à la question suivante en réinitialisant certains paramètres.
    this.questionIndex ++;
    this.showAnswer = false;
    this.solution = "";
    this.toggledChoices = [false, false, false, false];
    this.answerStatus = "correcte";

    this.renderMath();
  }

  async showScore() {
    // on met à jour le questions_data de l'utilisateur à l'aide de this.mcq_data
    let questions_data = (await this.storage.get("questions_data"));
    questions_data[this.sectorId][this.domainId][this.chapterId] = this.mcq_data;
    this.storage.set("questions_data", questions_data);

    // on réinitialise les paramètres du qcm (a priori c'est inutile)
    this.questionIndex = 1;
    this.showAnswer = false;
    this.solution = "";
    this.toggledChoices = [false, false, false, false];
    this.answerStatus = "correcte";

    // on affiche la page de score
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
    // cette méthode permet d'appliquer un style CSS particulier à certaines réponses.
    // la logique est trop complexe pour figurer dans le template HTML
    const currentChoice = this.typedChoices[this.questionIndex - 1][index];
    const nextChoice = this.typedChoices[this.questionIndex - 1][index + 1];
  
    const hasWordingAfter = currentChoice.wordingAfter && currentChoice.wordingAfter.length > 0;
    const isLastChoice = index === this.typedChoices[this.questionIndex - 1].length - 1;
    const nextHasWordingBefore = nextChoice && nextChoice.wordingBefore && nextChoice.wordingBefore.length > 0;
  
    return !hasWordingAfter && (isLastChoice || nextHasWordingBefore);
  }
}
