import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PhpData {
  status : 'ok' | 'error';
  data : any;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private backendUrl = "http://127.0.0.1:3000/"

  constructor(private httpClient : HttpClient) { }

  sendMessage (url : string, data : any) : Observable<PhpData> {
    const fullUrl = this.backendUrl + url;

    return this.httpClient.post<PhpData>(fullUrl, data, {withCredentials: true});
  }
}