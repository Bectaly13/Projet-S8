import { Injectable } from '@angular/core';

import { MessageService } from './message.service';
import { ErrorService } from './error.service';
import { StorageService } from './storage.service';
import { SharedVariablesService } from './shared-variables.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateQuestionsDataService {

  constructor(private message: MessageService,
              private error: ErrorService,
              private storage: StorageService,
              private variables: SharedVariablesService) { }
  
  // cette méthode permet de mettre à jour l'objet questions_data de l'utilisateur (pour sa filière) au fil des mises à jour de la BDD.
  // en particulier, si des domaines, chapitres ou questions sont ajoutés ou supprimés de la BDD, l'objet questions_data doit
  // suivre ces changements.
  updateQuestionsData(sectorId: number) {
    const mcqSize = this.variables.mcqSize.large;

    this.message.sendMessage("getDefaultQuestionsData", {sectorId: sectorId, mcqSize: mcqSize}).subscribe(async res => {
      console.log(res);
      if(res.status == 200) {
        let default_questions_data = res.data[sectorId]; // objet par défaut pour la filière de l'utilisateur
        // cet objet par défaut contient la dernière version de la BDD (domaines, chapitre et questions à jour),
        // mais chaque questions est marquée comme unseen (jamais vue).
        // simplement remplacer les données utilisateur par cet objet supprimerait les progrès de l'utilisateur.

        let questions_data = await this.storage.get("questions_data"); // objet actuel de l'utilisateur

        if (!questions_data || typeof questions_data !== "object") { // ceci ne devrait arriver que si les données sont corrompues
          questions_data[sectorId] = default_questions_data;
        }
        else if (!questions_data[sectorId] || typeof questions_data[sectorId] !== "object") { // même chose
          questions_data[sectorId] = default_questions_data;
        }

        else {
          for(let domainId of Object.keys(default_questions_data)) { // pour chaque domaine de la BDD
            if (!(domainId in questions_data[sectorId])) { // si le domaine n'est pas dans l'objet utilisateur
              questions_data[sectorId][domainId] = default_questions_data[domainId]; // on l'ajoute avec ses données par défaut
            }
            else {
              for(let chapterId of Object.keys(default_questions_data[domainId])) { // pour chaque chapitre dans la BDD
                if (!(chapterId in questions_data[sectorId][domainId])) { // si le chapitre n'est pas dans l'objet utilisateur
                  questions_data[sectorId][domainId][chapterId] = default_questions_data[domainId][chapterId]; // on l'ajoute avec ses données par défaut
                }
                else {
                  // sinon, on récupère les questions par défaut pour ce chapitre (unseen)
                  let default_unseen = default_questions_data[domainId][chapterId].unseen;
                  let default_unseen_set = new Set<number>(default_unseen);
    
                  // on récupère le progrès utilisateur (les questions unseen, incorrect et correct)
                  let correct = questions_data[sectorId][domainId][chapterId].correct;
                  let incorrect = questions_data[sectorId][domainId][chapterId].incorrect;
                  let unseen = questions_data[sectorId][domainId][chapterId].unseen;
    
                  // si des questions ont été supprimées de la BDD, on les supprime de l'objet utilisateur   
                  correct = correct.filter((qId: any) => default_unseen_set.has(qId));
                  incorrect = incorrect.filter((qId: any) => default_unseen_set.has(qId));
                  unseen = unseen.filter((qId: any) => default_unseen_set.has(qId));
    
                  // si des questions ont été ajoutées à la BDD, on les ajoute à l'objet utilisateur en tant que questions unseen
                  for (let questionId of default_unseen) {
                    if (!correct.includes(questionId) && !incorrect.includes(questionId) && !unseen.includes(questionId)) {
                      unseen.push(questionId);
                    }
                  }
    
                  // on injecte les nouvelles données   
                  questions_data[sectorId][domainId][chapterId] = {
                    correct: correct,
                    incorrect: incorrect,
                    unseen: unseen
                  }
                }
              }

              for (let chapterId of Object.keys(questions_data[sectorId][domainId])) { // pour chaque chapitre de l'objet utilisateur
                if (!(chapterId in default_questions_data[domainId])) { // si le chapitre n'est plus dans la BDD
                  delete questions_data[sectorId][domainId][chapterId]; // on le supprime de l'objet utilisateur
                }
              }
            }
          }

          for (let domainId of Object.keys(questions_data[sectorId])) { // pour chaque domaine de l'objet utilisateur
            if (!(domainId in default_questions_data)) { // si le domaine n'est plus dans la BDD
              delete questions_data[sectorId][domainId]; // on le supprime de l'objet utilisateur
            }
          }
        }

        // on met à jour l'objet utilisateur
        this.storage.set("questions_data", questions_data);
      }
      else {
        this.error.errorMessage(res);
      }
    });
  }
}
