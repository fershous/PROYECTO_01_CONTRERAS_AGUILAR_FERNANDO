import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js';

import { BackendService } from 'src/app/services/backend.service';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

interface Summary {
  name: string;
  icon: string;
  color: string;
  data: number;
  id: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  sales: any;
  annual: number;
  monthly: number;
  list: any;

  ELEMENT_DATA;
  displayedColumns: string[] = ['id', 'name', 'category', 'pieces'];

  summary: Summary[] = [
    {id: 0, name: 'annual sales', icon: 'fas fa-chart-bar', color: 'bg-danger', data: 0},
    {id: 1, name: 'annual pieces', icon: 'fas fa-chart-pie', color: 'bg-warning', data: 0},
    {id: 2, name: 'monthly sales', icon: 'fas fa-chart-pie', color: 'bg-success', data: 0},
    {id: 3, name: 'monthly pieces', icon: 'fas fa-chart-pie', color: 'bg-info', data: 0},
  ];

  constructor( private backendService: BackendService ) { }

  ngOnInit() {

    var chartOrders = document.getElementById('chart-orders');

    var chartSales = document.getElementById('chart-sales');

    parseOptions(Chart, chartOptions());

    this.backendService.getData()
      .subscribe(resp => {

        console.log(resp)

        this.sales = resp;
        this.summary[0].data = this.sales.total_annual;
        this.summary[1].data = this.sales.pieces_sold;
        this.summary[2].data = this.sales.monthly_average;
        this.summary[3].data = this.sales.average_sold;

        const labels: any = [];
        const data: any = [];
        this.sales.top_selling.sort();
        for (const month of this.sales.top_selling) {
           labels.push(month[1]);
           data.push(month[3]);
        }

        var ordersChart = new Chart(chartOrders, {
          type: 'bar',
          options: chartExample2.options,
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Sales',
                data: data
              }
            ]
          }
        });

        const labelSales: any = [];
        const dataSales: any = [];
        for (const month of this.sales.monthly_sales) {
          labelSales.push(month[1]);
          dataSales.push(month[2] / 1000);
        }

        this.salesChart = new Chart(chartSales, {
          type: 'line',
          options: chartExample1.options,
          data: {
            labels: labelSales,
            datasets: [
              {
                label: 'Sales',
                data: dataSales
              }
            ]
          }
        });

        this.list = this.sales.product_dictionary.slice(1,6);

        this.ELEMENT_DATA = this.sales.top_products.slice(1,6);
    });

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
