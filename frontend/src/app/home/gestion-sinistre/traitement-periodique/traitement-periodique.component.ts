import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-traitement-periodique',
  templateUrl: './traitement-periodique.component.html',
  styleUrls: ['./traitement-periodique.component.scss']
})
export class TraitementPeriodiqueComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openAnnulation(){
    this.router.navigateByUrl('/home/gestion-sinistre/traitement-periodique/traitement-mensuel');
  }
}
