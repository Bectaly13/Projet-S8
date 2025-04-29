import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter } from '@ionic/angular/standalone';

import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, IonFooter]
})
export class StatsPage {

  constructor(private darkmode: DarkModeService) { }

}
