import { Component, OnInit } from '@angular/core';
import { Dem_Pers } from '../../../../model/dem_Pers';
import { TransfertDataService } from '../../../../services/transfertData.service';
import {Location} from '@angular/common';

@Component({
  selector: 'ngx-voirpdf-societe',
  templateUrl: './voirpdf-societe.component.html',
  styleUrls: ['./voirpdf-societe.component.scss']
})
export class VoirpdfSocieteComponent implements OnInit {

  demandeback: Dem_Pers;
  pdfSrc:any;
  constructor(private transfertData: TransfertDataService,private _location: Location) { 
    //this.pdf = this.transfertData.getData();
  }
  
    backClicked() {
      this.demandeback.list_document_lu[this.i]=this.filename;
      this.demandeback.checked=true;
      this.transfertData.setData(this.demandeback);
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
    const fileReader = new FileReader();
  fileReader.onload = () => {
      this.pdfSrc = new Uint8Array(fileReader.result as ArrayBuffer);
      console.log(this.pdfSrc)
  };
  fileReader.readAsArrayBuffer(data[0]);    
  

  }
}
