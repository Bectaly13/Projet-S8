import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { SharedVariablesService } from './shared-variables.service';

export interface BackendResponse {
  status: number;
  data: any; 
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private backendUrl: string = this.variables.backendUrl;  

  constructor(private httpClient: HttpClient,
              private variables: SharedVariablesService) { }

  sendMessage(url : string, data : any): Observable<BackendResponse> {
    const fullUrl = this.backendUrl + url;

    return this.httpClient.post(fullUrl, data, {withCredentials: true, observe: 'response'}).pipe(map((res: HttpResponse<any>) => ({
      status: res.status,
      data: res.body.data
    })));
  }
}