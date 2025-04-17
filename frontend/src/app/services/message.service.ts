import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface BackendResponse {
  status: number;
  data: any; 
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private backendUrl = "http://127.0.0.1:3000/"

  constructor(private httpClient : HttpClient) { }

  sendMessage (url : string, data : any) : Observable<BackendResponse> {
    const fullUrl = this.backendUrl + url;

    return this.httpClient.post(fullUrl, data, {withCredentials: true, observe: 'response'}).pipe(map((res: HttpResponse<any>) => ({
      status: res.status,
      data: res.body.data
    })));
  }
}