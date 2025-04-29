import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-stats-domain',
  templateUrl: './stats-domain.page.html',
  styleUrls: ['./stats-domain.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StatsDomainPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
