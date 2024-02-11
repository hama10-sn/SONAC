import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { UploadService } from '../../../../services/upload.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { Router } from '@angular/router';
import { ViewPdfComponent } from './view-pdf/view-pdf.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ngx-gestion-dossier',
  templateUrl: './gestion-dossier.component.html',
  styleUrls: ['./gestion-dossier.component.scss']
})
export class GestionDossierComponent implements OnInit {

  displayInfoAdmin: boolean = false;
  display: boolean = false;
  displayDemande: boolean = false;
  displayContrats: boolean = false;
  displayFinanciers: boolean = false;
  displayClient: boolean = false;
  displayAutre: boolean = false;
  displayTeleClient: boolean = false;

  displayUpload: boolean = false;

  deplacer: boolean = false;
  displayprogress: boolean = false;
  hasScroll:boolean = true;

  files: File[];
  selectedFile = null;
  progress: number = 0;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  numClient: string ;
  client: any;
  @Input() name: any;

  filenamesAutres: string[];
  filenamesClient: string[];
  filenamesTeleClient: string[];
  filenamesInfoAdmin: string[];
  filenamesDemandes: string[];
  filenamesContrats: string[];
  filenamesFinanciers: string[];

  selectedDossierDest: string;

  aff: Boolean = true;

  baseUrl:string;

  constructor(private uploadService: UploadService,private toastrService: NbToastrService,
    private dialogService: NbDialogService,private transfertData: TransfertDataService, private router: Router) { }

  ngOnInit(): void {


    //dossier demande ==> sinistre

    this.baseUrl = environment.baseUrl ;
    
    if(this.name == null){
      this.client =  this.transfertData.getData();
      this.numClient = this.client.clien_numero;
    }
    else{
    this.client = this.name;
    this.numClient = this.client.clien_numero;
    this.aff = false;
    
  }
    
    this.ongetFilesAutre();
    this.ongetFilesClient();
    this.ongetFilesTeleClient();
    this.ongetFilesInfoAdmin();
    this.ongetFilesDemandes();
    this.ongetFilesContrats();
    this.ongetFilesFinanciers();

  }

  onCLickInfoAdmin () {
  this.displayInfoAdmin = true;
  this.displayDemande = false;
  this.displayContrats = false;
  this.displayFinanciers = false;
  this.displayClient = false;
  this.displayAutre = false;
  this.displayTeleClient = false;
  this.displayUpload = false;
  }
  onCLickDemande () {
    this.displayInfoAdmin = false;
    this.displayDemande = true;
    this.displayContrats = false;
    this.displayFinanciers = false;
    this.displayClient = false;
    this.displayAutre = false;
    this.displayTeleClient = false;
    this.displayUpload = false;
  }
  onCLickContrats() {
      this.displayInfoAdmin = false;
      this.displayDemande = false;
      this.displayContrats = true;
      this.displayFinanciers = false;
      this.displayClient = false;
      this.displayAutre = false;
      this.displayTeleClient = false;
      this.displayUpload = false;
  }

  onCLickFinanciers () {
    this.displayInfoAdmin = false;
    this.displayDemande = false;
    this.displayContrats = false;
    this.displayFinanciers = true;
    this.displayClient = false;
    this.displayAutre = false;
    this.displayTeleClient = false;
    this.displayUpload = false;
    }


    onCLickClient () {
      this.displayInfoAdmin = false;
      this.displayDemande = false;
      this.displayContrats = false;
      this.displayFinanciers = false;
      this.displayClient = true;
      this.displayAutre = false;
      this.displayTeleClient = false;
      this.displayUpload = false;
      }
      onCLickAutre () {
        this.displayInfoAdmin = false;
        this.displayDemande = false;
        this.displayContrats = false;
        this.displayFinanciers = false;
        this.displayClient = false;
        this.displayAutre = true;
        this.displayTeleClient = false;
        this.displayUpload = false;
        }

        onCLickTeleClient () {
          this.displayInfoAdmin = false;
          this.displayDemande = false;
          this.displayContrats = false;
          this.displayFinanciers = false;
          this.displayClient = false;
          this.displayAutre = false;
          this.displayTeleClient = true;
          this.displayUpload = false;
          }
          onCLickUpload () {
            this.displayInfoAdmin = false;
            this.displayDemande = false;
            this.displayContrats = false;
            this.displayFinanciers = false;
            this.displayClient = false;
            this.displayAutre = false;
            this.displayTeleClient = false;
            this.displayUpload = true;
            }


ongetFilesAutre () {
  this.uploadService.getFilesAutres(this.numClient)
  .subscribe(data => this.filenamesAutres = data as string[]);
 }
 ongetFilesClient () {
  this.uploadService.getFilesDossier(this.numClient,'client')
  .subscribe(data => this.filenamesClient = data as string[]);
 }
 ongetFilesTeleClient () {
  this.uploadService.getFilesDossier(this.numClient,'download')
  .subscribe(data => this.filenamesTeleClient = data as string[]);
 }
 ongetFilesInfoAdmin () {
  this.uploadService.getFilesDossier(this.numClient,'InfoAdmin')
  .subscribe(data => this.filenamesInfoAdmin = data as string[]);
 }
 ongetFilesDemandes () {
  this.uploadService.getFilesDossier(this.numClient,'demandes')
  .subscribe(data => this.filenamesDemandes = data as string[]);
 }
 ongetFilesContrats () {
  this.uploadService.getFilesDossier(this.numClient,'contrats')
  .subscribe(data => this.filenamesContrats = data as string[]);
 }
 ongetFilesFinanciers () {
  this.uploadService.getFilesDossier(this.numClient,'financiers')
  .subscribe(data => this.filenamesFinanciers = data as string[]);
 }


 cancel() {
  this.router.navigateByUrl('/home/gestion-client');
}

 onFileSelected (event) {
  this.selectedFile = event.target.files;
    console.log(this.selectedFile);
}

openpdf(filename,dossier) {

  this.uploadService.downloadInDossier(filename,this.numClient,dossier)
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
          this.transfertData.setData(event.body);
          //this.router.navigateByUrl("/home/viewpdf");
          this.dialogService.open(ViewPdfComponent, { hasScroll:true });

          
      }
    });
  


}

 onClickUpload () {
  this.displayprogress = true;
  this.files = this.selectedFile;
  const form = new FormData();
  for(const file of this.files) {
    form.append('files', file, file.name);
  }
  

  this.uploadService.uploadInDossier(form,this.numClient,'download')
    .subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('upload ok', event.status);
          setTimeout(() => {
            this.progress = 0;
            this.displayprogress = false;
          }, 1500);
          if(event.status == 200){
            this.ongetFilesAutre();
            this.ongetFilesClient();
            this.ongetFilesTeleClient();
            this.ongetFilesInfoAdmin();
    this.ongetFilesDemandes();
    this.ongetFilesContrats();
    this.ongetFilesFinanciers();
          this.toastrService.show(
            'Upload reussi avec succes !',
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 0,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
          } else {
            this.toastrService.show(
              'une erreur est survenue',
              'Notification',
              {
                status: this.statusFail,
                destroyByClick: true,
                duration: 0,
                hasIcon: true,
                position: this.position,
                preventDuplicates: false,
              });
          }
    }

});

}




 onClickDeplacer (dossierDest,dossierFrom,filename) {
   
  this.uploadService.deplacerFile(filename,this.numClient,dossierFrom,dossierDest)
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
          
          if(event.status == 200){
            this.ongetFilesAutre();
            this.ongetFilesClient();
            this.ongetFilesTeleClient();
            this.ongetFilesInfoAdmin();
    this.ongetFilesDemandes();
    this.ongetFilesContrats();
    this.ongetFilesFinanciers();
          this.toastrService.show(
            'Fichier deplacé avec succes !',
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 0,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
          } else {
            this.toastrService.show(
              'Impossible de deplacer ce fichier !',
              'Notification',
              {
                status: this.statusFail,
                destroyByClick: true,
                duration: 0,
                hasIcon: true,
                position: this.position,
                preventDuplicates: false,
              });
          }
      }
    });
    
 }


onChangeDeplacer(event) {
  this.selectedDossierDest = event;
  this.deplacer = true;
}




 onClickDownload(filename: string,dossier: string) {
  this.uploadService.downloadInDossier(filename,this.numClient,dossier)
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
          console.log(event.body);
          saveAs(event.body,filename);
      }
    });
}
onClickDownloadClient(filename: string) {
  this.uploadService.download(filename,this.numClient)
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
          console.log(event.body);
          saveAs(event.body,filename);
      }
    });
}




onClickDelete (filename: string,dossier: string) {
  this.uploadService.deleteFileInDossier(filename,this.numClient,dossier)
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
          
          if(event.status == 200){
            this.ongetFilesAutre();
            this.ongetFilesClient();
            this.ongetFilesTeleClient();
            this.ongetFilesInfoAdmin();
    this.ongetFilesDemandes();
    this.ongetFilesContrats();
    this.ongetFilesFinanciers();
          this.toastrService.show(
            'Suppression reussi avec succes !',
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 0,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
          } else {
            this.toastrService.show(
              'une erreur est survenue',
              'Notification',
              {
                status: this.statusFail,
                destroyByClick: true,
                duration: 0,
                hasIcon: true,
                position: this.position,
                preventDuplicates: false,
              });
          }
      }
    });
}


onClickDeleteClient (filename: string) {
  this.uploadService.deleteFile(filename,this.numClient)
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
          
          if(event.status == 200){
            this.ongetFilesAutre();
            this.ongetFilesClient();
            this.ongetFilesTeleClient();
            this.ongetFilesInfoAdmin();
    this.ongetFilesDemandes();
    this.ongetFilesContrats();
    this.ongetFilesFinanciers();
          this.toastrService.show(
            'Suppression reussi avec succes !',
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 0,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
          } else {
            this.toastrService.show(
              'une erreur est survenue',
              'Notification',
              {
                status: this.statusFail,
                destroyByClick: true,
                duration: 0,
                hasIcon: true,
                position: this.position,
                preventDuplicates: false,
              });
          }
      }
    });
}



}
