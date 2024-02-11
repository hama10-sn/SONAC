import { Component, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-page-not-autoriser',
  templateUrl: './page-not-autoriser.component.html',
  styleUrls: ['./page-not-autoriser.component.scss']
})
export class PageNotAutoriserComponent implements OnInit {

  constructor(private menuService: NbMenuService) { }

  ngOnInit(): void {
  }
  goToHome() {
    this.menuService.navigateHome();
  }
}
