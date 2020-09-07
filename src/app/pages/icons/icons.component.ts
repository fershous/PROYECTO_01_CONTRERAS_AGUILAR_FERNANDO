import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BackendService } from 'src/app/services/backend.service';

interface Category {
  category: string;
  sales: number;
}

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  data: any;
  categories: Category[];
  cat_1: any[] = [];
  cat_2: any[] = [];

  displayedColumns: string[] = ['id', 'name', 'date', 'score', 'refund'];
  displayedColumns2: string[] = ['id', 'sales', 'pieces'];
  dataSource: MatTableDataSource<any>;
  @ViewChild ('TableOnePaginator', {static: true}) tableOnePaginator: MatPaginator;
  @ViewChild ('TableOneSort', {static: true}) tableOneSort: MatSort;
  dataSource2: MatTableDataSource<any>;
  @ViewChild ('TableTwoPaginator', {static: true}) tableTwoPaginator: MatPaginator;
  @ViewChild ('TableTwoSort', {static: true}) tableTwoSort: MatSort;
  dataSource3: MatTableDataSource<any>;
  @ViewChild ('TableThreePaginator', {static: true}) tableThreePaginator: MatPaginator;
  @ViewChild ('TableThreeSort', {static: true}) tableThreeSort: MatSort;

  public copy: string;
  constructor( private backendService: BackendService ) { }

  ngOnInit() {

    this.backendService.getSales()
      .subscribe(resp => {

        this.data = resp;

        for (const category of Object.entries(this.data.categories).slice(0, 4)) {
          this.cat_1.push(category);
        }
        for (const category of Object.entries(this.data.categories).slice(4, 9)) {
          this.cat_2.push(category);
        }

        this.dataSource = new MatTableDataSource(this.data.sales);
        this.dataSource.paginator = this.tableOnePaginator;
        this.dataSource.sort = this.tableOneSort;

        this.dataSource2 = new MatTableDataSource(this.data.filtered.slice(0, 50));
        this.dataSource2.paginator = this.tableTwoPaginator;
        this.dataSource2.sort = this.tableTwoSort;

        this.dataSource3 = new MatTableDataSource(this.data.filtered.slice(51, 100));
        this.dataSource3.paginator = this.tableThreePaginator;
        this.dataSource3.sort = this.tableThreeSort;


        console.log(this.data);
      });
  }
}
