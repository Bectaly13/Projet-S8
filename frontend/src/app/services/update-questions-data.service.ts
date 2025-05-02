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
  
  updateQuestionsData(sectorId: number) {
    const mcqSize = this.variables.mcqSize.large;

    this.message.sendMessage("getDefaultQuestionsData", {sectorId: sectorId, mcqSize: mcqSize}).subscribe(async res => {
      console.log(res);
      if(res.status == 200) {
        let default_questions_data = res.data[sectorId]; // default data for this sector ID

        let questions_data = await this.storage.get("questions_data"); // current user data

        if (!questions_data || typeof questions_data !== "object") { // this should only happen if data is corrupted
          questions_data[sectorId] = default_questions_data;
        }
        else if (!questions_data[sectorId] || typeof questions_data[sectorId] !== "object") { // this should only happen if data is corrupted
          questions_data[sectorId] = default_questions_data;
        }

        else {
          for(let domainId of Object.keys(default_questions_data)) { // for each existing domain in the database
            if (!(domainId in questions_data[sectorId])) { // if the domain is not is user data (yet)
              questions_data[sectorId][domainId] = default_questions_data[domainId]; // add it with default data
            }
            else {
              for(let chapterId of Object.keys(default_questions_data[domainId])) { // for each existing chapter in the database
                if (!(chapterId in questions_data[sectorId][domainId])) { // if the chapter is not in user data (yet)
                  questions_data[sectorId][domainId][chapterId] = default_questions_data[domainId][chapterId]; // add it with default data
                }
                else {
                  // all questions for this chapter (they are all unseen in default data)
                  let default_unseen = default_questions_data[domainId][chapterId].unseen;
                  let default_unseen_set = new Set<number>(default_unseen);
    
                  // current user data for this chapter
                  let correct = questions_data[sectorId][domainId][chapterId].correct;
                  let incorrect = questions_data[sectorId][domainId][chapterId].incorrect;
                  let unseen = questions_data[sectorId][domainId][chapterId].unseen;
    
                  // if questions were deleted from database, then delete them from user data    
                  correct = correct.filter((qId: any) => default_unseen_set.has(qId));
                  incorrect = incorrect.filter((qId: any) => default_unseen_set.has(qId));
                  unseen = unseen.filter((qId: any) => default_unseen_set.has(qId));
    
                  // if questions were added to database, then add them to user data (as unseen questions)
                  for (let questionId of default_unseen) {
                    if (!correct.includes(questionId) && !incorrect.includes(questionId) && !unseen.includes(questionId)) {
                      unseen.push(questionId);
                    }
                  }
    
                  // we inject the new data    
                  questions_data[sectorId][domainId][chapterId] = {
                    correct: correct,
                    incorrect: incorrect,
                    unseen: unseen
                  }
                }
              }

              for (let chapterId of Object.keys(questions_data[sectorId][domainId])) { // for each chapter in user data
                if (!(chapterId in default_questions_data[domainId])) { // if the chapter is not in database (anymore)
                  delete questions_data[sectorId][domainId][chapterId]; // delete it from user data
                }
              }
            }
          }

          for (let domainId of Object.keys(questions_data[sectorId])) { // for each domain in user data
            if (!(domainId in default_questions_data)) { // if the domain is not in databse (anymore)
              delete questions_data[sectorId][domainId]; // delete it from user data
            }
          }
        }

        // we update user data
        this.storage.set("questions_data", questions_data);
      }
      else {
        this.error.errorMessage(res);
      }
    });
  }
}
