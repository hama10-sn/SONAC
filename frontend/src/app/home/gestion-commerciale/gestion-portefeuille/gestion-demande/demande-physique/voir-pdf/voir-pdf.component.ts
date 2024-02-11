import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import WebViewer from '@pdftron/webviewer';
import { TransfertDataService } from '../../../../../../services/transfertData.service'; 
import {Location} from '@angular/common';
import { Dem_Pers } from '../../../../../../model/dem_Pers';
import { TransfertData2Service } from '../../../../../../services/transfert-data2.service';

@Component({
  selector: 'ngx-voir-pdf',
  templateUrl: './voir-pdf.component.html',
  styleUrls: ['./voir-pdf.component.scss']
})
export class VoirPdfComponent implements OnInit {

  /* @ViewChild('viewer') viewerRef: ElementRef
  pdf :any ; */
  dem_Pers: Dem_Pers;
  pdfSrc:any;
  constructor(private transfertData: TransfertDataService,private transfertData2: TransfertData2Service,private _location: Location) { 
    //this.pdf = this.transfertData.getData();
  }
  
    backClicked() {
      this.dem_Pers.list_document_lu[this.i]=this.filename;
      this.dem_Pers.checked=true;
      this.transfertData.setData(this.dem_Pers);
      let data2 =[this.produitdeux,this.produittrois,this.produittroisvrai,this.check,this.ngModelValue];
      this.transfertData2.setData(data2);
      this._location.back();
    }

  i;
  filename;
  produitdeux;
  produittrois;
  produittroisvrai;
  check;
  ngModelValue;

  //pdfSrc = this.transfertData.getData();
  ngOnInit(): void {
    let data=[] ; 
    data = this.transfertData.getData();
    
    this.dem_Pers=data[1];
    this.filename = data[2];
    this.i = data[3];
    let data2 =[];
    data2=this.transfertData2.getData();
    this.produitdeux=data2[0];
    this.produittrois = data2[1];
    this.produittroisvrai=data2[2]
    this.check=data2[3];
    this.ngModelValue=data2[4]
    console.log(this.produitdeux);
    const fileReader = new FileReader();
  fileReader.onload = () => {
      this.pdfSrc = new Uint8Array(fileReader.result as ArrayBuffer);
      console.log(this.pdfSrc)
  };
  fileReader.readAsArrayBuffer(data[0]);    
  

  }

  /* ngAfterViewInit(): void {
    WebViewer({
      path:'../../../../../assets/lib',
    }, this.viewerRef.nativeElement).then(instance => {
      console.log(this.pdf);
      instance.UI.loadDocument(this.pdf, { filename: 'myfile.pdf' });

      const { documentViewer } = instance.Core;
    documentViewer.addEventListener('documentLoaded', () => {
      // perform document operations
    });

    });


  } */

}
