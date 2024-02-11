import { Component, OnInit } from '@angular/core';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { Router } from '@angular/router';
import { Client } from '../../../../model/Client';
import { Mvtsinistre } from '../../../../model/Mvtsinistre';
import { Sinistre } from '../../../../model/Sinistre';
import { SinistreFront } from '../../../../model/SinistreFront';
import { AcheteurService } from '../../../../services/acheteur.service';
import { ClientService } from '../../../../services/client.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { ProduitService } from '../../../../services/produit.service';
import { sinistreService } from '../../../../services/sinistre.service';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { User } from '../../../../model/User';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { UserService } from '../../../../services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-view-modification-sap',
  templateUrl: './view-modification-sap.component.html',
  styleUrls: ['./view-modification-sap.component.scss']
})
export class ViewModificationSapComponent implements OnInit {

  // ======== Des variables pour le complement de document
  addForm = this.fb.group({

    document: ['']
  });

  listDocuments: String[] = [];
  taille: number
  documentDejaDansListe: boolean = false;
  documentFinale = "";
  separateurDocument: string = "_";

  // ===== FIN COMPLEMENT DOCUMENT

  sinistreFront: SinistreFront;
  sinistreForm: Sinistre;
  mvtsinistreForm: Mvtsinistre;

  client: Client;
  intermediaire: any;
  produit: any;
  acheteur: any;
  login_demandeur: string;
  demandeur: string;
  user: User;

  constructor(
    private transferData: TransfertDataService,
    private clientService: ClientService,
    private intermediaireService: IntermediaireService,
    private produitService: ProduitService,
    private acheteurService: AcheteurService,
    private sinistreService: sinistreService,
    private router: Router,
    private authService: NbAuthService,
    private userService: UserService,
    private transfertData: TransfertDataService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          // this.autorisation = token.getPayload().fonctionnalite.split(',');

          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });

    this.sinistreFront = this.transferData.getData();
    console.log(this.sinistreFront);

    this.sinistreForm = this.sinistreFront?.sinistreForm;
    this.mvtsinistreForm = this.sinistreFront?.mvtsinistreForm;

    console.log(this.sinistreForm);
    console.log(this.mvtsinistreForm);

    this.clientService.getClient(this.sinistreForm.sini_souscripteur)
      .subscribe((data1) => {
        this.client = data1;
        console.log(this.client);
      });

    this.intermediaireService.getIntemediaire(this.sinistreForm.sini_intermediaire)
      .subscribe((data2) => {
        this.intermediaire = data2;
        console.log(this.intermediaire);
      });

    this.produitService.getProduit(this.sinistreForm.sini_produit)
      .subscribe((data3) => {
        this.produit = data3;
        console.log(this.produit);
      });

    this.acheteurService.getAcheteur(this.sinistreForm.sini_acheteur)
      .subscribe((data4) => {
        this.acheteur = data4;
        console.log(this.acheteur);
      });
  }

  onGetLibelleByTypeMvts(num: any) {
    if (num == 3) {
      return 'Modification Evaluation';
    } else if (num == 4) {
      return 'Modification SAP';
    }
  }

  cancel() {

    this.router.navigateByUrl('home/gestion-sinistre/liste-sinistre');
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

    if (this.listDocuments.length === 0) {
      this.documentFinale = "vide"
    } else {
      this.onValiderDocument();
    }

    this.sinistreService.generateEditionFicheModificationSAP(demandeurNew, this.documentFinale, this.sinistreFront)
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
            saveAs(event.body, 'Modification sap.pdf');
        }
      });
  }

  // ============ FONCTIONALITE POUR LE COMPLEMENT DE DOCUMENTS ==================
  onAddDocument() {

    const index: number = this.listDocuments.indexOf(this.addForm.get("document").value);

    if (index == -1) {
      this.listDocuments.push(this.addForm.get("document").value)
      this.addForm.controls['document'].setValue("");
      this.documentDejaDansListe = false;
    } else {
      this.documentDejaDansListe = true;
    }
  }

  onDeleteDocument(doc) {
    const index: number = this.listDocuments.indexOf(doc);
    if (index !== -1) {
      this.listDocuments.splice(index, 1);
    }
  }

  onValiderDocument() {
    console.log(this.listDocuments);

    this.documentFinale = "";
    for (let i = 0; i < this.listDocuments.length; i++) {
      if (i == (this.listDocuments.length - 1)) {
        this.documentFinale += this.listDocuments[i];
      } else {
        this.documentFinale += this.listDocuments[i] + this.separateurDocument;
      }
    }

    console.log(this.documentFinale);
  }

  // ========= FIN FONCTIONNALITE ADD DOCUMENT =========

}
