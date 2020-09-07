import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BackendService } from 'src/app/services/backend.service';

interface Summary {
  title: string;
  data: string;
  subtitle: string;
  number: number;
}

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  data: any;
  top_products: any;
  worst_products: any;
  summary: Summary[];
  categories: string[];
  filter = 'All';

  displayedColumns: string[] = ['id', 'name', 'reviews', 'score', 'stock'];
  dataSource: MatTableDataSource<any>;
  dataSource2: MatTableDataSource<any>;

  @ViewChild ('TableOnePaginator', {static: true}) tableOnePaginator: MatPaginator;
  @ViewChild ('TableOneSort', {static: true}) tableOneSort: MatSort;

  @ViewChild ('TableTwoPaginator', {static: true}) tableTwoPaginator: MatPaginator;
  @ViewChild ('TableTwoSort', {static: true}) tableTwoSort: MatSort;

  constructor( private backendService: BackendService ) { }

  ngOnInit() {
    this.backendService.getReviews()
      .subscribe(resp => {
        this.data = resp;

        this.top_products = this.data.top_reviews;

        this.dataSource = new MatTableDataSource(this.top_products);
        this.dataSource.paginator = this.tableOnePaginator;
        this.dataSource.sort = this.tableOneSort;

        this.worst_products = this.data.worst_reviews;

        this.dataSource2 = new MatTableDataSource(this.worst_products);
        this.dataSource2.paginator = this.tableTwoPaginator;
        this.dataSource2.sort = this.tableTwoSort;

        this.summary = [
          // tslint:disable: max-line-length
          { title: 'Best seller', data: this.data.best_seller.name.split(',')[0], subtitle: 'Pieces sold', number: this.data.best_seller.pieces_sold },
          { title: 'Most popular', data: this.data.most_popular.name.split(',')[0], subtitle: 'Score', number: this.data.most_popular.score },
          { title: 'Least sold', data: this.data.worst_seller.name.split(',')[0], subtitle: 'Pieces sold', number: this.data.worst_seller.pieces_sold },
          { title: 'Less popular', data: this.data.less_popular.name.split(',')[0], subtitle: 'Score', number: this.data.less_popular.score },
        ];

        this.categories = Object.keys(this.data.categories);
        console.log(this.categories);

        console.log(resp);
      });
  }

  filterCategory(value: any) {
    if (value.srcElement.id) {
      this.filter = value.srcElement.id;
    } else {
      this.filter = 'All';
    }
    const filterValue = value.srcElement.id;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
