import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { BackendService } from 'src/app/services/backend.service';
declare const google: any;

interface Summary {
  title: string;
  data: string;
  subtitle: string;
  number: number;
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  data: any;
  summary: Summary[];
  categories: string[];
  filter = 'All';

  displayedColumns: string[] = ['id', 'name', 'category', 'price', 'stock'];
  dataSource: MatTableDataSource<any>;

  @ViewChild ('TableOnePaginator', {static: true}) tableOnePaginator: MatPaginator;
  @ViewChild ('TableOneSort', {static: true}) tableOneSort: MatSort;

  constructor( private backendService: BackendService ) { }

  ngOnInit() {
      this.backendService.getStock()
        .subscribe(resp => {
          this.data = resp;
          this.categories = Object.keys(this.data.categories);

          this.dataSource = new MatTableDataSource(this.data.products.slice(1, this.data.products.length));
          this.dataSource.paginator = this.tableOnePaginator;
          this.dataSource.sort = this.tableOneSort;

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
