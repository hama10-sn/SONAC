import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import WebViewer from '@pdftron/webviewer';
import { TransfertDataService } from '../../../../../services/transfertData.service';

@Component({
  selector: 'ngx-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss']
})
export class ViewPdfComponent implements OnInit{

  /* @ViewChild('viewer') viewerRef: ElementRef
  pdf :any ; */
  pdfSrc:any;
  constructor(private transfertData: TransfertDataService) { 
    //this.pdf = this.transfertData.getData();
  }

  
  //pdfSrc = this.transfertData.getData();
  ngOnInit(): void {
    const fileReader = new FileReader();
  fileReader.onload = () => {
      this.pdfSrc = new Uint8Array(fileReader.result as ArrayBuffer);
      console.log(this.pdfSrc)
  };
  fileReader.readAsArrayBuffer(this.transfertData.getData());     
  

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
