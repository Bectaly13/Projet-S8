import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonButton, IonList, IonItem, AlertController } from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';

import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFooter, NavbarComponent, IonButton, IonList, IonItem]
})
export class FaqPage {
  mail: string = "appli.qmax@gmail.com";
  subject: string = "Demande d'information";

  headers: string[] = [
    "C'est quoi QMax ?",
    "Les questions",
    "Signaler des questions",
    "Modes de révision",
    "Nous soutenir",
    "L'équipe QMax"
  ]

  messages: string[] = [
    `QMax vous permet d'apprendre et de réviser votre cours de physique-chimie de maths-sup à l'aide de QCMs.
    Plus de 3000 questions soigneusement classées et corrigées vous sont proposées gratuitement, sans publicité
    ni exploitation de données personnelles. Les questions couvrent un vaste éventail de filières de CPGE, pour
    répondre à tous vos besoins.
    
    Bonnes révisions !`,

    `Les questions se présentent sous forme de QCMs, avec jusqu'à 4 propositions de réponse. Il peut arriver qu'aucune
    réponse ne soit correcte, ou bien que toutes le soient ! Mais ce sont des cas rares.
    
    Les questions testent la connaissance pure des définitions et des formules essentielles, mais pas seulement : l'objectif
    est également de développer les capacités de raisonnement et la culture scientifique de l'étudiant. Le style est concis,
    utilisant un maximum de schémas et de vocabulaire scientifique. C'est la forme de rédaction recherchée dans les copies.
    
    Il est possible de répondre de tête, sans papier ni crayon, à la majorité des questions. Cela nécessite de la concentration,
    ce qui aide l'étudiant à apprendre activement son cours.
    
    En aucun cas l'application ne se substitue aux professeurs, à leurs cours et à leurs exercices. Elle n'est qu'un complément,
    permettant de réactiver rapidement une notion précise du cours (mode "J'apprends"), ou de se tester sur l'ensemble d'un chapitre
    (mode "Je révise").`,

    `Si, lorsque vous êtes en train de répondre à un QCM, vous pensez avoir trouvé une erreur dans une question - faute
    d'orthographe, mauvaise correction ou autre -, appuyez simplement sur le bouton en bas de l'écran. Un mail s'ouvre alors
    à notre adresse, comportant en objet le numéro de la question. Ainsi, vous pouvez nous contacter facilement !`,

    `L'application QMax vous propose deux modes de révision :

    - Le mode "J'apprends", qui vous posera des questions sur des compétences spécifiques du chapitre sélectionné ;
    - Le mode "Je révise", qui vous interrogera sur la totalité du chapitre.
    
    Adaptez vous révisions en fonction de vos besoins !`,

    `Si vous aimez QMax et que vous souhaitez nous soutenir, vous pouvez aimer notre page Facebook, ou aider à la diffusion
    de l'appli en partageant notre site internet à vos amis !`,

    `L'équipe QMAX est composée de :
    Maxime Bonis, Laure Becker, Christophe Becker et Camille Ulrich, à l'initiative du projet ;
    Valentine Goman, Dorian Cadenel et Akim Zouaoui, étudiants en informatique à POLYTECH Marseille, responsables du développement.
    
    Nous remercions également Marielle Roussange, Jessica Vives, Pascal Bertin, Jean Geoffroy, Vincent Grenard, Armelle Trentin,
    Maxime Voisin, Loïc Roisin et Jean-Pierre Dubarry pour leur inestimable contribution.`
  ]

  constructor(private alert: AlertController) { }

  openText(index: number) {
    const header = this.headers[index];
    const message = this.messages[index];
    this.alert.create({
      header: header,
      message: message,
      buttons: ['OK']
    }).then((alert) => {
      alert.present();
      alert.onDidDismiss();
    })
  }

  async openBrowser(link: string) {
    await Browser.open({url: link});
  }
}
