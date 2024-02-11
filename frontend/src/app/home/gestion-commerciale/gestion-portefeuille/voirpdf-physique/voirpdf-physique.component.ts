import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Dem_Pers } from '../../../../model/dem_Pers';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { TransfertData2Service } from '../../../../services/transfertData2.service';
import { Prospect } from '../../../../model/Prospect';
@Component({
  selector: 'ngx-voirpdf-physique',
  templateUrl: './voirpdf-physique.component.html',
  styleUrls: ['./voirpdf-physique.component.scss']
})
export class VoirpdfPhysiqueComponent implements OnInit {

  demandeback: Dem_Pers;
  prospect: Prospect;
  pdfSrc:any;
  demandeEnvoye: boolean=true;
  constructor(private transData: TransfertData2Service,private transfertData: TransfertData2Service,private _location: Location) { 
    //this.pdf = this.transfertData.getData();
  }
  
    backClicked() {
      //console.log(this.demandeback.list_document_lu[this.i]);
      this.demandeback.list_document_lu[this.i]=this.filename;
      this.demandeback.checked=true;
      console.log(this.demandeback);
      let data=[this.demandeback,this.demandeEnvoye]
      this.transfertData.setData(this.prospect);
      this.transData.setData(data);
      this._location.back();
    }

  i;
  filename;
  //pdfSrc = this.transfertData.getData();
  ngOnInit(): void {
    
    let data=[] ;
    data = this.transfertData.getData();
    this.demandeback=data[1];
    this.filename = data[2];
    this.i = data[3];
    this.demandeEnvoye=data[4];
    const fileReader = new FileReader();
  fileReader.onload = () => {
      this.pdfSrc = new Uint8Array(fileReader.result as ArrayBuffer);
      console.log(this.pdfSrc)
  };
  fileReader.readAsArrayBuffer(data[0]);    
  
  this.prospect= this.transfertData.getData();
  }
}
