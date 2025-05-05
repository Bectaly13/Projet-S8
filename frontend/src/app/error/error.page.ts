import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, IonButton, IonIcon]
})
export class ErrorPage {

  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(["home"]);
  }
}
