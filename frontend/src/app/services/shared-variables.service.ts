import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {
  mcqSize: number = 10;

  constructor() { }
}
