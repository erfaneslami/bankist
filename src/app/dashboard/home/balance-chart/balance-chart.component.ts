import {
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from 'src/app/entrance/auth.service';
import { User } from 'src/app/entrance/models/user.model';
import { UserService } from 'src/app/entrance/user.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-balance-chart',
  templateUrl: './balance-chart.component.html',
  styleUrls: ['./balance-chart.component.scss'],
})
export class BalanceChartComponent implements OnInit, OnDestroy {
  @ViewChild('myChart', { static: true }) myChart: any;

  user: User;
  userSub: Subscription;
  income: number;
  expense: number;
  balance: number;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
    });
    this.income = this.userService.getIncome(this.user.movements);
    this.expense = this.userService.getExpense(this.user.movements);
    this.balance = this.userService.getBalance(this.user.movements);
    this.creatChart(this.income, this.expense);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onFilterWeek() {
    const filterMovements = this.user.movements.filter((mov) => {
      return (
        moment(mov.time).toDate() > moment().startOf('day').toDate() &&
        moment(mov.time).toDate() < moment().endOf('day').toDate()
      );
    });

    this.expense = this.userService.getExpense(filterMovements);
    this.income = this.userService.getIncome(filterMovements);
    this.balance = this.userService.getBalance(filterMovements);

    this.myChart.nativeElement.data.datasets[0].data[0] = this.income;
    this.myChart.nativeElement.data.datasets[0].data[1] = this.expense;
    this.myChart.nativeElement.update();
  }

  onFilterMonth() {
    const filterMovements = this.user.movements.filter((mov) => {
      return (
        moment(mov.time).toDate() > moment().startOf('month').toDate() &&
        moment(mov.time).toDate() < moment().endOf('month').toDate()
      );
    });

    this.expense = this.userService.getExpense(filterMovements);
    this.income = this.userService.getIncome(filterMovements);
    this.balance = this.userService.getBalance(filterMovements);

    this.myChart.nativeElement.data.datasets[0].data[0] = this.income;
    this.myChart.nativeElement.data.datasets[0].data[1] = this.expense;
    this.myChart.nativeElement.update();
  }

  onFilterYear() {
    const filterMovements = this.user.movements.filter((mov) => {
      return (
        moment(mov.time).toDate() > moment().startOf('year').toDate() &&
        moment(mov.time).toDate() < moment().endOf('year').toDate()
      );
    });

    this.expense = this.userService.getExpense(filterMovements);
    this.income = this.userService.getIncome(filterMovements);
    this.balance = this.userService.getBalance(filterMovements);

    this.myChart.nativeElement.data.datasets[0].data[0] = this.income;
    this.myChart.nativeElement.data.datasets[0].data[1] = this.expense;
    this.myChart.nativeElement.update();
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
