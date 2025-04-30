import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {
  version: string = "bêta"

  mcqSize: any = {
    small: 5,
    large: 10
  };
  choiceLabels: string[] = ["A", "B", "C", "D"];
  skillValidationThreshold: number = 70;

  domainsImageUrl: string = "http://127.0.0.1:3000/data/domains/";
  scoreImageUrl: string = "http://127.0.0.1:3000/data/score/";
  questionImagesUrl: string = "http://127.0.0.1:3000";

  mail: string = "appli.qmax@gmail.com";
  faqSubject: string = "Demande d'information";
  
  site: string = "https://appli.qmax.fr/";
  facebook: string = "https://www.facebook.com/appli.qmax/";

  camilleUlrich: string = "https://www.camilleulrich.fr/";

  constructor() { }
}
