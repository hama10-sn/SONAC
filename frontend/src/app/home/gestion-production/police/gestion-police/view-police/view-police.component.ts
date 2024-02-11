import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../../model/Client';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { Produit } from '../../../../../model/Produit';
import { ClientService } from '../../../../../services/client.service';
import { IntermediaireService } from '../../../../../services/intermediaire.service';
import { PoliceService } from '../../../../../services/police.service';
import { ProduitService } from '../../../../../services/produit.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import types from '../../../../data/types.json';

@Component({
  selector: 'ngx-view-police',
  templateUrl: './view-police.component.html',
  styleUrls: ['./view-police.component.scss']
})
export class ViewPoliceComponent implements OnInit {
  police:any;
  client:Client = new Client();
  intermediaire:Intermediaire = new Intermediaire();
  produit: Produit = new Produit();
  numpol:number;

  listTypeclient: any[] = types;
  listNatureCredit: any;
  creditNature: any;
  nbAcheteurs: any;
  listTypeRisqueRgl: any;
  listTypeDeposit: any;
  typeRisqueR: any;
  typeDeposit: any;
  listTypeLocatif: any;
  typeLoc: any;

  constructor(private policeService : PoliceService, private clientService : ClientService
    ,private intermediaireService : IntermediaireService,private produitService: ProduitService
    ,private transfetData : TransfertDataService) { }

  ngOnInit(): void {
    this.numpol = Number(this.transfetData.getData());
    this.policeService.getPoliceAll(this.numpol)
    .subscribe((data) => {

      console.log(data);
      this.police = data;
      console.log(this.police.acte.act_id);

      this.clientService.getClient(this.police.policeForm.poli_client)
    .subscribe((data1) => {
      this.client = data1;
      console.log(this.client);

    });

    this.intermediaireService.getIntemediaire(this.police.policeForm.poli_intermediaire)
    .subscribe((data2) => {
      this.intermediaire = data2;
      console.log(this.intermediaire);

    });

    this.produitService.getProduit(this.police.policeForm.poli_codeproduit)
    .subscribe((data3) => {
      this.produit = data3;
      console.log(this.produit);

    });

    

    this.listNatureCredit = this.listTypeclient['TYPE_NATURE_CREDIT'];
    this.listTypeRisqueRgl = this.listTypeclient['TYPE_RISQUE_REGL'];
    this.listTypeDeposit = this.listTypeclient['TYPE_DEPOSIT'];
    this.listTypeLocatif = this.listTypeclient['TYPE_RISQUE_LOCATIF'];

    if(this.police.policeForm.poli_branche == 15 && this.police.policeForm.poli_codeproduit > 15001005 ){
    this.typeRisqueR = this.listTypeRisqueRgl.find(p => p.id == this.police.risqueR.riskr_type).value;
    this.typeDeposit = this.listTypeDeposit.find(p => p.id == this.police.risqueR.riskr_typedeposit).value;
    }

    if(this.police.policeForm.poli_branche == 14){
    this.creditNature =this.listNatureCredit.find(p => p.id == this.police.credit.credit_type).value;
    this.nbAcheteurs = this.police.acheteurs.length;
    }
    
    if(this.police.policeForm.poli_codeproduit == 16008001){
    this.typeLoc = this.listTypeLocatif.find(p => p.id == this.police.risqueLocatif.riskl_type).value;
    this.nbAcheteurs = this.police.acheteurs.length;
  }

  
    
    
    

    });

    

    
    


  }

}
