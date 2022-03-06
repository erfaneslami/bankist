import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-balance-chart',
  templateUrl: './balance-chart.component.html',
  styleUrls: ['./balance-chart.component.scss'],
})
export class BalanceChartComponent implements OnInit {
  @ViewChild('myChart', { static: true }) myChart: any;
  constructor() {}

  ngOnInit(): void {
    this.creatChart(1000, 17500);
  }

  creatChart(income: number, expense: number) {
    Chart.register(...registerables);
    const ctx = this.myChart.nativeElement;

    this.myChart.nativeElement = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [
          {
            label: '# of Votes',
            data: [income, expense],
            backgroundColor: ['#ba66f9', '#03a9f4'],
            borderColor: ['#ba66f9', '#03a9f4'],
            borderWidth: 1,
            spacing: 5,
            borderRadius: 30,
          },
        ],
      },
      options: {
        cutout: '80%',
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
