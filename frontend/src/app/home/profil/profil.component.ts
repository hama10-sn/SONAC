import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { User } from '../../model/User';
import { UserService } from '../../services/user.service';
import { ModifPhotoComponent } from './modif-photo/modif-photo.component';
import { ModifProfilComponent } from './modif-profil/modif-profil.component';

@Component({
  selector: 'ngx-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  user: User;
  login: any;
  image: any = 'https://via.placeholder.com/350';

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';


  constructor(private userService: UserService,private authService: NbAuthService,
    private dialogService: NbDialogService, private toastrService: NbToastrService,
    private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.getlogin();
    
    
  }

  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
      .subscribe((data: User) => {
        this.user = data;
        console.log(this.user);
        this.ongetPhoto(this.user);
      });
        }
      });
  }
  ongetPhoto(user){

    this.userService.getPhoto(user.util_login, user.util_id)
      .subscribe((data) => {
        this.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      });


  }
  openModif() {
    this.dialogService.open(ModifProfilComponent, {
      context: {
        user: this.user,
      },
    })
    .onClose.subscribe(data => data && this.userService.changePassword(data.login, data.passwordOld, data.passwordNew)
    .subscribe(() => {
      this.toastrService.show(
        'Mot de passe modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       
    },
      (error) => {
        console.log(error);
        this.toastrService.show(
          "le mot de passe saisie n'est pas identique au mot de passe d'avant",
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 7000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.openModif();
      },
    ));
  }


  openModifPhoto() {
    this.dialogService.open(ModifPhotoComponent, {
      context: {
        image: this.image,
        login: this.user.util_login,
        id: this.user.util_id,
      },
    // tslint:disable-next-line:max-line-length
    }).onClose.subscribe(data => data && this.userService.updatePhoto(data, this.user.util_login, this.user.util_id)
    .subscribe(() => {
      this.toastrService.show(
        'Photo de profil modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        const reader = new FileReader();

        reader.readAsDataURL(data);
        reader.onload = (_event) => {
        this.image = reader.result;
        }
    },
    (error) => {
      console.log(error);
      this.toastrService.show(
        'une erreur est survenue !',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 7000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    ));

}

}

