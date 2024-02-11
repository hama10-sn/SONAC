import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Mvtsinistre } from '../../../../model/Mvtsinistre';
import { RecoursFront } from '../../../../model/RecoursFront';
import { User } from '../../../../model/User';
import { RecoursService } from '../../../../services/recours.service';
import { sinistreService } from '../../../../services/sinistre.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import { saveAs } from 'file-saver';
import { Sinistre } from '../../../../model/Sinistre';
import { Client } from '../../../../model/Client';
import { Acheteur } from '../../../../model/Acheteur';
import { Produit } from '../../../../model/Produit';
import { Intermediaire } from '../../../../model/Intermediaire';
import { ProduitService } from '../../../../services/produit.service';
import { AcheteurService } from '../../../../services/acheteur.service';
import { ClientService } from '../../../../services/client.service';

@Component({
  selector: 'ngx-view-encaissement-recours',
  templateUrl: './view-encaissement-recours.component.html',
  styleUrls: ['./view-encaissement-recours.component.scss']
})
export class ViewEncaissementRecoursComponent implements OnInit {
  recoursFront: RecoursFront;
  mvtsinistreForm: Mvtsinistre;
  sinistreForm: Sinistre;
  login_demandeur: string;
  demandeur: string;
  user: User;

  client: any;
  produit: any;
  acheteur: any;

  constructor(private router: Router,
    private transferData: TransfertDataService,
    private recoursService: RecoursService,
    private sinistreService: sinistreService,
    private produitService: ProduitService,
    private acheteurService: AcheteurService,
    private clientService: ClientService,
    private authService: NbAuthService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.recoursFront = this.transferData.getData();
    this.mvtsinistreForm = this.recoursFront.mvtsinistreForm;
    this.sinistreService.getSinistreByNumero(this.mvtsinistreForm.mvts_numsinistre)
      .subscribe((data: any) => {
        this.sinistreForm = data.data;
        this.clientService.getClient(this.sinistreForm.sini_souscripteur)
          .subscribe((data1) => {
            this.client = data1;
          });

        this.produitService.getProduit(this.sinistreForm.sini_produit)
          .subscribe((data3) => {
            this.produit = data3;
          });

        this.acheteurService.getAcheteur(this.sinistreForm.sini_acheteur)
          .subscribe((data4) => {
            this.acheteur = data4;
          });
      })
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.login_demandeur = token.getPayload().sub;
        this.onGetUser(this.login_demandeur);
      }
    });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onExport() {
    let demandeurNew = this.demandeur.replace(/ /g, "_");
    this.recoursService.generateFicheRecoursEncaisse(demandeurNew, this.recoursFront)
      .subscribe(event => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            break;
          case HttpEventType.Response:
            saveAs(event.body, 'recours encaissé.pdf');
        }
    });
  }

  cancel() {
    this.router.navigateByUrl('home/gestion-sinistre/liste-sinistre');
  }
}
