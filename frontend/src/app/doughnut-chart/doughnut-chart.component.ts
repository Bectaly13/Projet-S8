import { Component, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
  inputs: ['correct', 'incorrect', 'unseen', 'domainId'],
  styles: ['canvas {max-width: 300px; max-height: 300px;}']
})
export class DoughnutChartComponent implements OnChanges {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;

  correct!: number;
  incorrect!: number;
  unseen!: number;
  domainId!: number;

  chart!: Chart;

  constructor() { }

  ngOnChanges(): void {
    if(this.chart) {
      this.chart.destroy();
    }

    this.createChart();
  }

  private createChart(): void {
    // On s'assure que les variables d'input on bien été transmises par le parent.
    if (this.correct == null || this.incorrect == null || this.unseen == null || this.domainId == null) {
      return;
    }

    // On crée ensuite l'objet "chart".

    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const computedStyles = getComputedStyle(document.documentElement);

    const correctColor = computedStyles.getPropertyValue('--ion-color-color' + this.domainId).trim();
    const incorrectColor = computedStyles.getPropertyValue('--ion-color-grey-high-contrast').trim();
    const unseenColor = computedStyles.getPropertyValue('--ion-color-grey-medium-contrast').trim();
    const legendColor = computedStyles.getPropertyValue('--ion-color-grey-highest-contrast').trim();

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Bien répondues (' + this.correct + ')',
          'Mal répondues (' + this.incorrect + ')',
          'Non découvertes (' + this.unseen + ')'
        ],
        datasets: [{
          data: [
            this.correct,
            this.incorrect,
            this.unseen
          ],
          backgroundColor: [
            correctColor,
            incorrectColor,
            unseenColor
          ],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '60%',
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 20,
              usePointStyle: true,
              padding: 10,
              color: legendColor
            }
          }
        }
      }
    });
  }
}
