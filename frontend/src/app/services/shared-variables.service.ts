import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {
  mcqSize: any = {
    small: 5,
    large: 10
  };
  choiceLabels: string[] = ["A.", "B.", "C.", "D."];

  domainsImageUrl: string = "assets/domains/";
  scoreImageUrl: string = "assets/score/";
  questionImagesUrl: string = "assets/questions";

  mail: string = "appli.qmax@gmail.com";
  faqSubject: string = "Demande d'information";
  
  site: string = "https://appli.qmax.fr/";
  facebook: string = "https://www.facebook.com/appli.qmax/";

  constructor() { }
}
