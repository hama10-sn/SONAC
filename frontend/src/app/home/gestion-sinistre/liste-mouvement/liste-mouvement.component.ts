import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sinistre } from '../../../model/Sinistre';
import { TransfertDataService } from '../../../services/transfertData.service';

@Component({
  selector: 'ngx-liste-mouvement',
  templateUrl: './liste-mouvement.component.html',
  styleUrls: ['./liste-mouvement.component.scss']
})
export class ListeMouvementComponent implements OnInit {
  sinistre: Sinistre;

  constructor(private router: Router,
    private transfertData: TransfertDataService
  ) { }

  ngOnInit(): void {
    this.sinistre = this.transfertData.getData();
  }

  openMvtEvaluation() {
    this.transfertData.setData(this.sinistre);
    this.router.navigateByUrl("/home/gestion-sinistre/liste-mouvement/liste-mouvement-evaluation");
  }

  openMvtSAP() {
    this.transfertData.setData(this.sinistre);
    this.router.navigateByUrl("/home/gestion-sinistre/liste-mouvement/liste-mouvement-sap");
  }

  openMvtPropReglement() {
    this.transfertData.setData(this.sinistre);
    this.router.navigateByUrl("/home/gestion-sinistre/liste-mouvement/liste-mouvement-proposition-reglement");
  }

  openMvtValiReglement() {
    this.transfertData.setData(this.sinistre);
    this.router.navigateByUrl("/home/gestion-sinistre/liste-mouvement/liste-mouvement-reglement-valide");
  }

  openMvtPropRecours() {
    this.transfertData.setData(this.sinistre);
    this.router.navigateByUrl("/home/gestion-sinistre/liste-mouvement/liste-mouvement-proposition-recours");
  }

  openMvtValiRecours() {
    this.transfertData.setData(this.sinistre);
    this.router.navigateByUrl("/home/gestion-sinistre/liste-mouvement/liste-mouvement-recours-valide");
  }

  openMvtEncRecours() {
    this.transfertData.setData(this.sinistre);
    this.router.navigateByUrl("/home/gestion-sinistre/liste-mouvement/liste-mouvement-recours-encaisse");
  }
}
