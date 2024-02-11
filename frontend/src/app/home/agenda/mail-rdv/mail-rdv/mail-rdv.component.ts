import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { RdvService } from '../../../../services/rdv.service';
//import '../ckeditor.loader';
import 'ckeditor';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../model/User';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { isObject } from 'util';
import { Mail } from '../../../../model/Mail';

@Component({
  selector: 'ngx-mail-rdv',
  templateUrl: './mail-rdv.component.html',
  styleUrls: ['./mail-rdv.component.scss']
})
export class MailRdvComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private toastrService: NbToastrService,
    private rdvService: RdvService, private authService: NbAuthService, private userService: UserService) { }

  addForm = this.fb.group({

    address_email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    // autorisation: [''],
    objet: ['', [Validators.required]],
    body: ['', [Validators.required]],
    infos_user: [''],
    add_email: ['', [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]]
    

  });
  erreur: boolean = false;
  email: String;
  address_email : String;
  objet: String;
  body: String;
  infos : String;
  add_email: String;
  problemeEmail: boolean = false;
  errorEmail: boolean;
  problemeObjet: boolean = false;
  problemeBody: boolean = false;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  texte: String;
  login: any;
  user: User;
  userBis: User;
  listMail: String[] = [];
  listMailJson
  taille: number
  problemeMail2: boolean = true;
  problemeMail1: boolean = true;
  mailDejaDansListe: boolean = false;
  selectedFile = null;
  displayButtonUpload: boolean = false;
  displayprogress: boolean = false;
  filenames: string[];
  files: File[];
  progress: number = 0;
  ngOnInit(): void {
    this.taille = this.listMail.length;
  }
  onchangeMail() {

    if (this.listMail.length != 0) {
      this.addForm.controls['address_email'].setValue(this.listMail[0]);
    }
    if (this.addForm.controls['address_email'].valid == false) {
      this.errorEmail = true;

    } else {
      this.errorEmail = false;
      this.taille = this.listMail.length;
    }
    if (!this.problemeEmail && !this.errorEmail && this.listMail.length == 0) {
      console.log(this.taille);
      //this.addForm.controls['add_email'].setValue("");
      this.listMail.push(this.addForm.get('address_email').value);
      this.listMailJson = JSON.stringify(this.listMail);
    } if (this.problemeEmail && this.errorEmail) {
      this.problemeEmail = false;
    }

  }
  onchangeMailBis() {
    //this.displayMailError = true;
    console.log('ici');
    if (this.addForm.controls['add_email'].valid == false) {
      this.problemeMail2 = true;
    } else {
      this.problemeMail2 = false;

    }
  }


  onFocusOutEventEmail() {
    this.email = this.addForm.get("address_email").value;
    if (this.listMail.length != 0) {
      this.addForm.controls['address_email'].setValue(this.listMail[0]);
    }


    if (this.email == null || this.email == "") {
      this.problemeEmail = true;
      this.erreur = true
    } else {
      this.problemeEmail = false;
      this.erreur = false;
      this.taille = this.listMail.length;
    }
    if (!this.problemeEmail && !this.errorEmail && this.listMail.length == 0) {
      console.log(this.taille)
      //this.addForm.controls['add_email'].setValue("");
      this.listMail.push(this.addForm.get('address_email').value)
      this.listMailJson = JSON.stringify(this.listMail);
    } if (this.problemeEmail && this.errorEmail) {
      this.problemeEmail = false;
    }
  }
  mail
  onFocusOutEventEmailBis() {
    this.mail = this.addForm.get("add_email").value;
    if (this.email == null || this.mail == "") {
      this.problemeMail1 = true;

    } else {
      this.problemeMail1 = false;
    }


  }
  onFocusOutEventObjet() {
    this.objet = this.addForm.get("objet").value;
    if (this.objet == null || this.objet == "") {
      this.problemeObjet = true;
      this.erreur = true
    } else {
      this.problemeObjet = false;
      this.erreur = false;
    }

  }
  onFocusOutEventBody() {
    this.body = this.addForm.get("body").value;
    if (this.addForm.controls['body'].valid == false) {
      this.problemeBody = true;
      this.erreur = true
    } else {
      this.problemeBody = false;
      this.erreur = false;
    }
  }

  getColorEmail() {
    if (this.problemeEmail || this.errorEmail) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorObjet() {
    if (this.problemeObjet) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorBody() {
    if (this.problemeBody) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getListMail() {
    if (!this.problemeBody && !this.errorEmail) {

    }
  }

  cancel() {
    //this.ref.close();
    this.router.navigateByUrl('home/agenda');
  }
  agent
  submit() {
    let nom;
    let prenom;
    let agent;
    let mail_agent;
    let telephone;
    let telephone_fixe;
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {

              this.user = data;

              let user = JSON.stringify(this.user);
              nom = this.user.util_nom;
              prenom = this.user.util_prenom;
              agent = this.user.util_type;
              mail_agent = this.user.util_email;
              telephone = this.user.util_telephoneportable;
              telephone_fixe = this.user.util_telephonefixe;

              ///this.addForm.controls["attachement"].setValue(this.pdfFile);
              //console.log(this.addForm.get('attachement').value);

              //this.addForm.controls['infos_user'].setValue(this.user.util_type);*/
              this.files = this.selectedFile;
              const form = new FormData();
              for (const file of this.files) {
                form.append('files', file, file.name);
              }
              //this.addForm.controls["files"].setValue(this.onClickUpload(form));
              this.addForm.controls['infos_user'].setValue("<p>Cet email vous est envoyé par " + prenom + " " + nom + "  " + agent + " de la SONAC</p> <p>Si vous voulez y répondre veuillez uniquement le faire sur l'email suivant " + mail_agent + "</p><p>ou l'appelez par téléphone au : " + telephone + " </p>");
              this.listMail.forEach(mail => {
                this.addForm.controls['address_email'].setValue(mail);
                console.log(this.addForm.value);

                //this.addForm.controls['attachement'].setValue(this.file);
                this.rdvService.onMail_Send(this.addForm.value,form)
                  .subscribe(() => {
                    this.toastrService.show(
                      'email envoyé avec succes à ! ' + mail,
                      'Notification',
                      {
                        status: this.statusSuccess,
                        destroyByClick: true,
                        duration: 300000,
                        hasIcon: true,
                        position: this.position,
                        preventDuplicates: false,
                      });
                    this.router.navigateByUrl('home/agenda');
                  },
                    (error) => {
                      this.toastrService.show(
                        'une erreur est survenue',
                        'Notification',
                        {
                          status: this.statusFail,
                          destroyByClick: true,
                          duration: 300000,
                          hasIcon: true,
                          position: this.position,
                          preventDuplicates: false,
                        });

                    });
              })
            })
        }
      })



  }
  
  onChangebody(event) {
    console.log(event); 
  }
  onDeleteMail(mail) {
    const index: number = this.listMail.indexOf(mail);
    if (index !== -1) {
      this.listMail.splice(index, 1);
      this.addForm.controls['address_email'].setValue(this.listMail[0]);
    }
    this.listMailJson = JSON.stringify(this.listMail);
    this.taille = this.listMail.length;
    if (this.taille == 0)
      this.addForm.controls['address_email'].setValue(this.listMail[0]);
  }
  onAddMail() {
    const index: number = this.listMail.indexOf(this.addForm.get("add_email").value);
    if (index == -1) {
      //this.listMail.splice(index, 1);
      this.listMail.push(this.addForm.get("add_email").value)
      this.listMailJson = JSON.stringify(this.listMail);
      this.taille = this.listMail.length;
      this.addForm.controls['add_email'].setValue("");
      this.problemeMail2 = true;
      this.problemeMail1 = true;
      this.mailDejaDansListe = false;
    } else {
      this.problemeMail2 = true;
      this.problemeMail1 = true;
      this.mailDejaDansListe = true;
    }

  }
  /*//selectedFile: any;
  selFile(event) {
   console.log(event.target.files[0].value);
  }
url
  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
    
      reader.onload = (event:any) => {
      console.log(this.url = event.target.result);
      }
    
     return reader.readAsDataURL(event.target.files[0]);
    }
    }
    file : File;
    /*(event) {
    console.log(this.file = event.target.files[0].pa);
  }
  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
    //this.file.pat
  }
  pdfFile
  selectedFile : any = null;
  @ViewChild('fileInput') fileInput: ElementRef;
  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.addForm.controls['attachement'].setValue({
          /*filename: file.name,
          filetype: file.type,
          value: reader.result,*/
  /*file
  
})
};
}
}
files : File[];
onFileSelected (event) {
this.selectedFile = event.target.files;
console.log(this.selectedFile);
this.files=this.selectedFile;
this.file= this.files[0];
 
console.log(this.files);
}*/

  //files : File[];
  onFileSelected(event) {
    this.selectedFile = event.target.files;
    console.log(this.selectedFile);
  }
  openAjout() {
    this.displayButtonUpload = true;
  }
  onClickUpload() {
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for (const file of this.files) {
      form.append('files', file, file.name);
    }
    const address_email = this.addForm.get("address_email").value;
    console.log(address_email);
    
    const objet = this.addForm.get("objet").value;
    const  body = this.addForm.get("body").value;
    //body= this.texte.valueOf;
    const infos = "meissa"
    this.rdvService.sendMail1(form,address_email,objet , body,infos)
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
            if (event.status == 200) {
              //this.ongetFiles();
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
  submit1() {
    let nom;
    let prenom;
    let agent;
    let mail_agent;
    let telephone;
    let telephone_fixe;
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {

              this.user = data;

              let user = JSON.stringify(this.user);
              nom = this.user.util_nom;
              prenom = this.user.util_prenom;
              agent = this.user.util_type;
              mail_agent = this.user.util_email;
              telephone = this.user.util_telephoneportable;
              telephone_fixe = this.user.util_telephonefixe;

              ///this.addForm.controls["attachement"].setValue(this.pdfFile);
              //console.log(this.addForm.get('attachement').value);

              //this.addForm.controls['infos_user'].setValue(this.user.util_type);*/
              this.files = this.selectedFile;
              const form = new FormData();
              if(this.files!=null)
                for (const file of this.files) {
                  form.append('files', file, file.name);
                }
              //this.addForm.controls["files"].setValue(this.onClickUpload(form));
              this.addForm.controls['infos_user'].setValue("<p>Cet email vous est envoyé par " + prenom + " " + nom + "  " + agent + " de la SONAC</p> <p>Si vous voulez y répondre veuillez uniquement le faire sur l'email suivant " + mail_agent + "</p><p>ou l'appelez par téléphone au : " + telephone + " </p>");
              this.addForm.controls['infos_user'].setValue("\nCet email vous est envoyé par " + prenom + " " + nom + "  " + agent + " de la SONAC<\n> \nSi vous voulez y répondre veuillez uniquement le faire sur l'email suivant " + mail_agent + "<\n>\nou l'appelez par téléphone au : " + telephone + " <\n>");
              this.infos= "\nCet email vous est envoyé par " + prenom + " " + nom + "  " + agent + " de la SONAC \nSi vous voulez y répondre veuillez uniquement le faire sur l'email suivant " + mail_agent + "\nou l'appelez par téléphone au : " + telephone + " \n";
              this.listMail.forEach(mail => {
              this.addForm.controls['address_email'].setValue(mail);
              const address_email = this.addForm.get("address_email").value;
              console.log(address_email);
              
              const objet = this.addForm.get("objet").value;
              const  body = this.addForm.get("body").value;
              //body= this.texte.valueOf;
              const infos = this.infos;
              
                //this.addForm.controls['attachement'].setValue(this.file);
                this.rdvService.sendMail1(form,address_email,objet, body,infos)
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
                  if (event.status == 200) {
                    //this.ongetFiles();
                    this.toastrService.show(
                      'email envoyé avec succes à ! ' + mail,
                      'Notification',
                      {
                        status: this.statusSuccess,
                        destroyByClick: true,
                        duration: 0,
                        hasIcon: true,
                        position: this.position,
                        preventDuplicates: false,
                      });
                      this.router.navigateByUrl('home/agenda');
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

              })
            })
        }
      })



  }
  submit2() {
    let nom;
    let prenom;
    let agent;
    let mail_agent;
    let telephone;
    let telephone_fixe;
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {

              this.user = data;

              let user = JSON.stringify(this.user);
              nom = this.user.util_nom;
              prenom = this.user.util_prenom;
              agent = this.user.util_type;
              mail_agent = this.user.util_email;
              telephone = this.user.util_telephoneportable;
              telephone_fixe = this.user.util_telephonefixe;

              ///this.addForm.controls["attachement"].setValue(this.pdfFile);
              //console.log(this.addForm.get('attachement').value);

             
              //this.addForm.controls["files"].setValue(this.onClickUpload(form));
              this.addForm.controls['infos_user'].setValue("<p>Cet email vous est envoyé par " + prenom + " " + nom + "  " + agent + " de la SONAC</p> <p>Si vous voulez y répondre veuillez uniquement le faire sur l'email suivant " + mail_agent + "</p><p>ou l'appelez par téléphone au : " + telephone + " </p>");
              this.addForm.controls['infos_user'].setValue("\nCet email vous est envoyé par " + prenom + " " + nom + "  " + agent + " de la SONAC<\n> \nSi vous voulez y répondre veuillez uniquement le faire sur l'email suivant " + mail_agent + "<\n>\nou l'appelez par téléphone au : " + telephone + " <\n>");
              this.infos= "\nCet email vous est envoyé par " + prenom + " " + nom + "  " + agent + " de la SONAC \nSi vous voulez y répondre veuillez uniquement le faire sur l'email suivant " + mail_agent + "\nou l'appelez par téléphone au : " + telephone + " \n";
              this.listMail.forEach(mail => {
              this.addForm.controls['address_email'].setValue(mail);
              let address_email = this.addForm.get("address_email").value;
              console.log(address_email);
              
              const objet = this.addForm.get("objet").value;
              const  body = this.addForm.get("body").value;
              this.addForm.controls['address_email'].setValue(mail)
              //body= this.texte.valueOf;
              const infos = this.infos;
              /*let email : Mail;
              email.address_email=mail;
              email.objet = objet;
              email.body = body;
              email.infos_user=infos;
              const email1 = email;*/
                //this.addForm.controls['attachement'].setValue(this.file);
                this.rdvService.sendMail2(this.addForm.value)
     .subscribe(() => {
       this.toastrService.show(
        'email envoyé avec succes à ! ' + mail,
         'Notification',
         {
           status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
           position: this.position,
           preventDuplicates: false,
         });
         this.router.navigateByUrl('home/agenda');
     },
     (error) => {
       this.toastrService.show(
         'une erreur est survenue',
         'Notification',
         {
           status: this.statusFail,
           destroyByClick: true,
           duration: 300000,
           hasIcon: true,
           position: this.position,
          preventDuplicates: false,
        });

  });


              })
            })
        }
      })



  }
  onSendEmail(){
    this.files = this.selectedFile;
    if(this.files!=null){
      this.submit1();
    }else{
      this.submit2()
    }
  }
}

