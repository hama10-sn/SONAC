import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UploadService } from '../../../../../services/upload.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-dossier-intermediaire',
  templateUrl: './dossier-intermediaire.component.html',
  styleUrls: ['./dossier-intermediaire.component.scss']
})
export class DossierIntermediaireComponent implements OnInit {
  displayButtonUpload: boolean = false;
  displayprogress: boolean = false;
  selectedFile = null;
  files: File[];
  progress: number = 0;
  filenames: string[];
  intermediaire: Intermediaire;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private toastrService: NbToastrService,private uploadService: UploadService,
    private router: Router, private transfertData: TransfertDataService ) { }

  ngOnInit(): void {

    this.intermediaire = this.transfertData.getData();
    this.ongetFiles();
    
  }

  openAjout () {
    this.displayButtonUpload =true;
  } 


  cancel() {
    this.router.navigateByUrl('/home/parametrage-general/intermediaires');
  }
  onFileSelected (event) {
    this.selectedFile = event.target.files;
      console.log(this.selectedFile);
  }
  ongetFiles () {
    this.uploadService.getFilesIntermediaire(this.intermediaire.inter_numero)
      .subscribe(data => this.filenames = data as string[]);
  }

  onClickUpload () {
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for(const file of this.files) {
      form.append('files', file, file.name);
    }

    this.uploadService.uploadIntermediaire(form,this.intermediaire.inter_numero)
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
              this.ongetFiles();
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
onClickDownload(filename: string) {
  this.uploadService.downloadInter(filename,this.intermediaire.inter_numero)
    .subscribe(event => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`downloaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log(event.body);
          saveAs(event.body,filename);
      }
    });
}


onClickDelete (filename: string) {
  this.uploadService.deleteFileIntermediaire(filename,this.intermediaire.inter_numero)
    .subscribe(event => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`downloaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          
          if(event.status == 200){
            this.ongetFiles();
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
