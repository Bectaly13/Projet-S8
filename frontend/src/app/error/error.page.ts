import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';

import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent, IonButton, IonIcon]
})
export class ErrorPage {

  constructor(private router: Router,
              private storage: StorageService) { }

  goHome() {
    this.storage.remove("sector_data");

    this.router.navigate(["home"]);
  }
}
