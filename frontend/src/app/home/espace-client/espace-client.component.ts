import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-espace-client',
  templateUrl: './espace-client.component.html',
  styleUrls: ['./espace-client.component.scss']
})
export class EspaceClientComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClickTarification() {
    this.router.navigateByUrl('/home/espace-client/simuler-tarification');
  }

  onClickDossier() {
    this.router.navigateByUrl('/home/espace-client/mesdossiers');
  }

}
