import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-start-mcq',
  templateUrl: './start-mcq.page.html',
  styleUrls: ['./start-mcq.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class StartMCQPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
