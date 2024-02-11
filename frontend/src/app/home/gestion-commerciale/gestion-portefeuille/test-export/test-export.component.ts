import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ngx-test-export',
  templateUrl: './test-export.component.html',
  styleUrls: ['./test-export.component.scss']
})
export class TestExportComponent implements OnInit {

  title = 'mte-test';
  displayedColumns = ['position', 'name', 'surname', 'birth', 'adresse'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<Element>;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

}

export interface Element {
  name: string;
  position: number;
  surname: string;
  birth: string;
  adresse: string;
}

const ELEMENT_DATA: Element[] = [
  {position: 1, name: 'Albert', surname: 'Einstein', birth: '1879', adresse: 'Dakar'},
  {position: 2, name: 'Marie', surname: 'Curie', birth: '1867', adresse: 'Ouakam'},
  {position: 3, name: 'Enrico', surname: 'Fermi', birth: '1901', adresse: 'Dakar'},
  {position: 4, name: 'Dmitri', surname: 'Mendeleev', birth: '1834', adresse: 'Ouakam'},
  {position: 5, name: 'Alfred', surname: 'Nobel', birth: '1833', adresse: 'Kaolack'},
  {position: 6, name: 'Ernest', surname: 'Lawrence', birth: '1901', adresse: 'Ouakam'},
  {position: 7, name: 'Glenn', surname: 'Seaborg', birth: '1912', adresse: 'Ouakam'},
  {position: 8, name: 'Niels', surname: 'Bohr', birth: '1885', adresse: 'Ouakam'},
  {position: 9, name: 'Lise', surname: 'Meitner', birth: '1878', adresse: 'Ouakam'},
  {position: 10, name: 'Wilhelm', surname: 'Röntgen', birth: '1845', adresse: 'Ouakam'},
  {position: 11, name: 'Nicolaus', surname: 'Copernicus', birth: '1473', adresse: 'Ouakam'},
  {position: 12, name: 'Georgy', surname: 'Flyorov', birth: '1913', adresse: 'Ouakam'},
  {position: 13, name: 'Yuri', surname: 'Oganessian', birth: '1933', adresse: ''},
  {position: 14, name: 'Johan', surname: 'Gadolin', birth: '1760', adresse: ''},
  {position: 15, name: 'Pierre', surname: 'Curie', birth: '1859', adresse: ''},
];

