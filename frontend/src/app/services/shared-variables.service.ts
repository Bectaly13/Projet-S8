import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {
  mcqSize: number = 10;
  /*
  mcqSize: any = {
    small: 5,
    large: 10
  };
  */
  choiceLabels: string[] = ["A", "B", "C", "D"];

  domainsImageUrl: string = "assets/domains/";
  scoreImageUrl: string = "assets/score/";

  mail: string = "appli.qmax@gmail.com";
  faqSubject: string = "Demande d'information";

  constructor() { }
}
