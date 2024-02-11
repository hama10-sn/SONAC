import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../../../model/Client';
import { Credit } from '../../../../model/Credit';
import { Mvtsinistre } from '../../../../model/Mvtsinistre';
import { RisqueLocatif } from '../../../../model/RisqueLocatif';
import { Sinistre } from '../../../../model/Sinistre';
import { SinistreFront } from '../../../../model/SinistreFront';
import { AcheteurService } from '../../../../services/acheteur.service';
import { ClientService } from '../../../../services/client.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { ProduitService } from '../../../../services/produit.service';
import { sinistreService } from '../../../../services/sinistre.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { User } from '../../../../model/User';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { UserService } from '../../../../services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-view-declaration-sinistre',
  templateUrl: './view-declaration-sinistre.component.html',
  styleUrls: ['./view-declaration-sinistre.component.scss']
})
export class ViewDeclarationSinistreComponent implements OnInit {

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
  creditForm: Credit;
  risque_locatifForm: RisqueLocatif;

  client: Client;
  intermediaire: any;
  produit: any;
  acheteur: any;
  login_demandeur: string;
  demandeur: string;
  user: User;

  afficherCredit: boolean = false;
  afficherRisqueLocatif: boolean = false;

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
    this.creditForm = this.sinistreFront?.creditForm;
    this.risque_locatifForm = this.sinistreFront?.risque_locatifForm;

    if (this.creditForm == null && this.risque_locatifForm != null) {
      this.afficherCredit = false;
      this.afficherRisqueLocatif = true;
    } else if (this.creditForm != null && this.risque_locatifForm == null) {
      this.afficherCredit = true;
      this.afficherRisqueLocatif = false;
    } else {
      this.afficherCredit = false;
      this.afficherRisqueLocatif = false;
    }

    // console.log(this.sinistreFront);
    // console.log(this.sinistreForm);
    // console.log(this.mvtsinistreForm);
    // console.log(this.creditForm);
    // console.log(this.risque_locatifForm);

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

  cancel() {
    if (this.sinistreForm.sini_branche == 14 || this.sinistreForm.sini_branche == 16) {
      this.router.navigateByUrl('home/gestion-sinistre/liste-menace-sinistre');
    } else {
      this.router.navigateByUrl('home/gestion-sinistre/declaration-sinistre/ajout');
    }
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onExport(typeDeclaration: String) {

    let demandeurNew = this.demandeur.replace(/ /g, "_");

    console.log(this.listDocuments.length)

    if (this.listDocuments.length === 0) {
      this.documentFinale = "vide"
    } else {
      this.onValiderDocument();
    }
    // let documentFinale = this.addDocument.onValider();
    //  const form = new FormData();
    // form.append('document', documentFinale);
    // console.log(documentFinale);

    this.sinistreService.generateEditionFicheMenaceSinistre(typeDeclaration, demandeurNew, this.documentFinale, this.sinistreFront)
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
            saveAs(event.body, 'declaration de sinistre.pdf');
        }
      });
    // }
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
