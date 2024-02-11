import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbGlobalPosition, NbGlobalPhysicalPosition, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Rdv } from '../../../model/Rdv';
import { RdvService } from '../../../services/rdv.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-dossier-rdv',
  templateUrl: './dossier-rdv.component.html',
  styleUrls: ['./dossier-rdv.component.scss']
})
export class DossierRdvComponent implements OnInit {

  displayButtonUpload: boolean = false;
  displayprogress: boolean = false;
  selectedFile = null;
  files: File[];
  progress: number = 0;
  filenames: string[];
  rdv: Rdv;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private toastrService: NbToastrService,private rdvService: RdvService,
    private router: Router, private transfertData: TransfertDataService ) { }

  ngOnInit(): void {

    this.rdv = this.transfertData.getData();
    this.ongetFiles();
    
  }

  openAjout () {
    this.displayButtonUpload =true;
  } 


  cancel() {
    this.router.navigateByUrl('/home/agenda');
  }
  onFileSelected (event) {
    this.selectedFile = event.target.files;
      console.log(this.selectedFile);
  }
  ongetFiles () {
    this.rdvService.getFilesRDV(this.rdv.id_rdv)
      .subscribe(data => this.filenames = data as string[]);
  }

  onClickUpload () {
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for(const file of this.files) {
      form.append('files', file, file.name);
    }

    this.rdvService.uploadRDV(form,this.rdv.id_rdv)
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
  this.rdvService.downloadRDV(filename, this.rdv.id_rdv)
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
  this.rdvService.deleteFileRDV(filename,this.rdv.id_rdv)
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
