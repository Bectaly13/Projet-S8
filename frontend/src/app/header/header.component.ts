import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, CommonModule, FormsModule],
  inputs: ['pageTitle', 'showBackButton'],
})
export class HeaderComponent {
  pageTitle: string = "";
  showBackButton: boolean = false;

  constructor() { }

}
