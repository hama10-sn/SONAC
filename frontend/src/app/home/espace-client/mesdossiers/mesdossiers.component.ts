import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { UploadService } from '../../../services/upload.service';
import { saveAs } from 'file-saver';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { User } from '../../../model/User';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-mesdossiers',
  templateUrl: './mesdossiers.component.html',
  styleUrls: ['./mesdossiers.component.scss']
})
export class MesdossiersComponent implements OnInit {


  displayButtonUpload: boolean = false;
  displayprogress: boolean = false;
  selectedFile = null;
  files: File[];
  progress: number = 0;

  filenames: string[];
  filenamesAutres: string[];
  filenamesDoc: string[];




  displayJustificatif: boolean = false;
  displayDoc: boolean = false;
  displayAutre: boolean = false;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  user: User;
  tokenn: any;

  constructor(private toastrService: NbToastrService,private uploadService: UploadService,
    private authService:NbAuthService, private userService:UserService,private router: Router ) { }

  ngOnInit(): void {
    


    this.authService.getToken()
                .subscribe((token: NbAuthJWTToken) => {
                  if (token.isValid()) {
                    this.tokenn = token.getPayload();
                    this.userService.getUser(this.tokenn.sub)
                      .subscribe((data: User) => {
                        this.user = data ;
                        this.ongetFiles(this.user);
                        this.ongetFilesAutre(this.user);
                        this.ongetFilesDocAtelecharger(this.user);
                        console.log(this.user.util_numclient);
                      });

                  }
                    // tslint:disable-next-line:no-console
                });


  }

  cancel() {
    this.router.navigateByUrl('/home/espace-client');
  }

  onclickJustificatif() {
    this.displayJustificatif = true;
    this.displayDoc = false;
    this.displayAutre = false;
  }
  onClickDoc(){
    this.displayDoc = true;
    this.displayJustificatif = false;
    this.displayAutre = false;
  }
  onClickAutre() {
    this.displayAutre = true;
    this.displayDoc = false;
    this.displayJustificatif = false;
  }
  openAjout () {
    this.displayButtonUpload =true;
  } 

  onFileSelected (event) {
    this.selectedFile = event.target.files;
      console.log(this.selectedFile);
  }

  onClickUpload () {
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for(const file of this.files) {
      form.append('files', file, file.name);
    }

    this.uploadService.upload(form,this.user.util_numclient)
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
              this.ongetFiles(this.user);
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

onClickUploadAutres () {
  this.displayprogress = true;
  this.files = this.selectedFile;
  const form = new FormData();
  for(const file of this.files) {
    form.append('files', file, file.name);
  }

  this.uploadService.uploadInDossier(form,this.user.util_numclient,'autres')
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
            this.ongetFilesAutre(this.user);
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
ongetFiles (user) {
  this.uploadService.getFilesDossier(user.util_numclient,'client')
    .subscribe(data => this.filenames = data as string[]);
}
ongetFilesDocAtelecharger (user) {
  this.uploadService.getFilesDossier(user.util_numclient,'download')
    .subscribe(data => this.filenamesDoc = data as string[]);
}
ongetFilesAutre (user) {
  this.uploadService.getFilesAutres(user.util_numclient)
    .subscribe(data => this.filenamesAutres = data as string[]);
}



onClickDownload(filename: string,dossier: string) {
  this.uploadService.downloadInDossier(filename,this.user.util_numclient,dossier)
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
onClickDownloadAutres(filename: string) {
  this.uploadService.downloadInDossier(filename,this.user.util_numclient,'autres')
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
  this.uploadService.deleteFileInDossier(filename,this.user.util_numclient,'client')
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
            this.ongetFiles(this.user);
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

onClickDeleteInDossier (filename: string) {
  this.uploadService.deleteFileInDossier(filename,this.user.util_numclient,'autres')
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
            this.ongetFilesAutre(this.user);
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
