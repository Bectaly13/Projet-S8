import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';

import { MessageService } from '../services/message.service';
import { ErrorService } from '../services/error.service';
import { DarkModeService } from '../services/dark-mode.service';
import { SharedVariablesService } from '../services/shared-variables.service';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

export interface FaqItem {
  title: string;
  content: FaqSubitem[];
}

export interface FaqSubitem {
  title: string;
  content: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, FormsModule, NavbarComponent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonIcon]
})
export class FaqPage implements ViewWillEnter {
  questionCount!: number;

  mcqSize!: any;
  skillValidationThreshold!: number;
  camilleUlrich!: string;
  mail!: string;
  subject!: string;
  site!: string;
  facebook!: string;

  camilleUlrichShort!: string;

  faq!: FaqItem[];

  constructor(private message: MessageService,
              private error: ErrorService,
              private darkmode: DarkModeService,
              private variables: SharedVariablesService) { }

  ionViewWillEnter(): void {
    this.darkmode.init(); // récupération des préférences relatives au thème sombre

    // récupération des variables globales

    this.mcqSize = this.variables.mcqSize;
    this.skillValidationThreshold = this.variables.skillValidationThreshold;
    this.camilleUlrich = this.variables.camilleUlrich;
    this.mail = this.variables.mail;
    this.subject = this.variables.faqSubject;
    this.site = this.variables.site;

    this.camilleUlrichShort = this.camilleUlrich.replace(/^https?:\/\//, '').replace(/\/$/, '');

    this.message.sendMessage("getQuestionCount", {}).subscribe(res => {
      console.log(res);
      if(res.status == 200) {
        this.questionCount = res.data[0]["COUNT(DISTINCT questionGroupId)"];

        this.faq = [
          {
            title: "Pour commencer",
            content: [
              {
                title: "À quoi sert cette application ?",
                content: "Qmax vous permet d'apprendre et de réviser votre cours de physique-chimie de CPGE par des QCM. " + this.questionCount + " questions classées et corrigées vous sont proposées gratuitement, sans publicité, sans authentification et sans exploitation de données personnelles."
              },
              {
                title: "Choix de la filière",
                content: "Cette nouvelle version traite la majeure partie des programmes de première année et de deuxième année, avec un système de filtrage suivant la filière. Pour avoir accès à toutes les questions, sélectionnez la filière \"No filter\"."
              },
              {
                title: "Est-ce que plusieurs réponses à une question peuvent être bonnes ?",
                content: "Oui, il s'agit de questionnaires à choix multiples. Pour certaines questions, il est même possible qu'il n'y ait aucune bonne réponse ou qu'il y ait 4 bonnes réponses ! Mais ce sont des cas rares."
              },
              {
                title: "J'ai vu quelques fautes dans les questions, comment vous les signaler ?",
                content: "Lorsque vous êtes en train de faire la question et voyez l'erreur, appuyez sur le bouton avec l'icone d'enveloppe. Un message s'ouvre alors à notre adresse, comportant en objet la référence de la question. On accepte aussi les compliments !"
              }
            ]
          },

          {
            title: "Présentation pédagogique",
            content: [
              {
                title: "",
                content: "Les questions testent la connaissance pure des définitions et des formules essentielles, mais pas seulement : l'objectif est également de développer les capacités de raisonnement et la culture scientifique de l'étudiant. Le style est concis, utilisant un maximum de schémas et de vocabulaire scientifique. C'est la forme de rédaction recherchée dans les copies, dont il faut s'imprégner."
              },
              {
                title: "",
                content: "Pour les questions les plus faciles, il est possible de répondre de tête. Pour certaines questions plus difficiles, un papier et un crayon pourront être utiles, ainsi que votre cours à portée de main !"
              },
              {
                title: "",
                content: "En aucun cas l'application ne se substitue aux professeurs, à leurs cours et à leurs exercices. Elle se veut un complément, permettant de réactiver rapidement une notion précise du cours en mode \"J'apprends\" ou de se tester sur l'ensemble d'un chapitre en mode \"Je révise\"."
              },
              {
                title: "",
                content: "L'application est agrémentée de dessins originaux visant à présenter avec humour les domaines de la physique ou à récompenser l'utilisateur à l'issue d'une série plus ou moins réussie ! Enfin, le nom de Qmax et son logo font référence à une grandeur physique au programme, saurez-vous l'identifier ?"
              }
            ]
          },

          {
            title: "Mode \"J'apprends\"",
            content: [
              {
                title: "",
                content: "Quand vous commencez dans Qmax, on vous invite à choisir un domaine puis un chapitre. Si ce chapitre a été récemment étudié en classe, le mode apprentissage est recommandé. Il vous propose une subdivision du chapitre."
              },
              {
                title: "",
                content: "Vous pouvez ainsi vous entraîner sur ces notions et tenter de les valider en faisant des séries de " + this.mcqSize.small + " questions. Une notion est validée lorsque votre pourcentage à l'horloge atteint au moins " + this.skillValidationThreshold + "%. Attention, il peut décroître !"
              }
            ]
          },

          {
            title: "Mode \"Je révise\"",
            content: [
              {
                title: "",
                content: "Si vous avez plus de recul sur le chapitre, le mode révision est alors adapté. Ici pas de choix de notion : une série de " + this.mcqSize.large + " questions balaye le chapitre entier."
              }
            ]
          },

          {
            title: "Statistiques",
            content: [
              {
                title: "Comment voir mes progrès ?",
                content: "Qmax enregistre votre progression et vous permet de consulter à tout moment vos statistiques personnelles. Vous pouvez suivre votre avancement pour chaque domaine et chaque chapitre accessible."
              },
              {
                title: "Synchronisation des données entre filières",
                content: "Notez que les statistiques ne sont pas partagées entre les différentes filières : vos progrès dans une filière ne sont pas pris en compte dans les autres."
              }
            ]
          },   
          
          {
            title: "Confidentialité",
            content: [
              {
                title: "Où vont mes données ?",
                content: "Toutes vos données (statistiques, progression, préférences...) sont stockées uniquement en local sur votre appareil. Elles ne sont ni transmises à un serveur distant, ni accessibles aux développeurs de l'application."
              }
            ]
          },

          {
            title: "L'équipe de Qmax",
            content: [
              {
                title: "Maxime Bonis",
                content: "À l'initiative du projet de Qmax, Maxime est professeur de physique-chimie en classes préparatoires aux grandes écoles, filière TSI, au lycée Antonin Artaud de Marseille. Il est l'auteur d'une grande partie des questions et pilote l'organisation pédagogique de l'application."
              },
              {
                title: "Laure Becker",
                content: "Diplômée de l'école d'ingénieur ENSIMAG, Laure est actuellement chef de projet et développeur logiciel dans une startup. Elle a supervisé les nombreux aspects informatiques de l'application, qui sont plus nombreux et complexes qu'on ne l'imagine !"
              },
              {
                title: "Christophe Becker",
                content: "Astrophysicien reconverti avec succès dans l'informatique, Christophe a également des qualités de graphiste. Il a réalisé les premières planches de dessin, l'intégralité du codage du design et a résolu de nombreux bug de fonctionnement général. Il est à ce jour l'homme à tout faire de l'équipe !"
              },
              {
                title: "Camille Ulrich",
                content: "Vous appréciez le design et les dessins de Qmax ? Ils ont été conçus par Camille Ulrich, dessinatrice et illustratrice free lance. Nous avons été ravis de la qualité de son travail et de sa réactivité. Toujours à l'écoute, Camille a également proposé des idées intéressantes sur l'organisation de l'application. Nous vous invitons à admirer ses travaux sur son site :"
              },
              {
                title: "Dorian Cadenel, Valentine Goman, Akim Zouaoui",
                content: "La version 2025 de Qmax a été réalisée par Dorian, Valentine et Akim, étudiants en informatique à Polytech Marseille, dans le cadre de leur projet de quatrième année. Leur réactivité et leur implication dans le projet ont été remarquables."
              },
              {
                title: "Prepas.org",
                content: "Qmax est soutenue par l'association des professeurs de classes préparatoires scientifiques. Plusieurs dizaines d'enseignants ont contribué et contribuent à la base de données des questions. Un grand merci !"
              }
            ]
          }
        ];
      }
      else {
        this.error.errorMessage(res);
      }
    })
  }
  
  // Cette méthode ouvre le navigateur sur l'appareil de l'utilisateur.
  async openBrowser(link: string) {
    await Browser.open({url: link});
  }
}
