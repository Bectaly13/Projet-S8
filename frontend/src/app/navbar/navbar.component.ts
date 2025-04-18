import { Component } from '@angular/core';
import { IonButtons, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonButtons, IonButton]
})
export class NavbarComponent {

  constructor() { }

}
