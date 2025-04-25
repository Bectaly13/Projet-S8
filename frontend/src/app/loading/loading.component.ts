import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() progress: number = 0;

  constructor() {}

  ngOnInit() {
    this.simulateLoading();
  }

  simulateLoading() {
    const interval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 2;
      } else {
        clearInterval(interval);
      }
    }, 100); // Simulation d'un chargement à intervalles réguliers
  }
}
