import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from 'src/app/entrance/auth.service';
import { User } from 'src/app/entrance/models/user.model';
import { UserService } from 'src/app/entrance/user.service';

@Component({
  selector: 'app-balance-chart',
  templateUrl: './balance-chart.component.html',
  styleUrls: ['./balance-chart.component.scss'],
})
export class BalanceChartComponent implements OnInit {
  @ViewChild('myChart', { static: true }) myChart: any;
  user: User;
  income: number;
  expense: number;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
    });
    this.creatChart(1000, 17500);
    this.income = this.userService.getIncome();
    this.expense = this.userService.getExpense();
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
