import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-modif-photo',
  templateUrl: './modif-photo.component.html',
  styleUrls: ['./modif-photo.component.scss']
})
export class ModifPhotoComponent implements OnInit {
  image: any;
  login: String;
  id: String;
  selectedFile = null;

  constructor(protected ref: NbDialogRef<ModifPhotoComponent>) { }

  ngOnInit(): void {
  }

  
  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.selectedFile);
  }

  onFileSelected(event){
      this.selectedFile = event.target.files[0];
      //this.image = event.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
      this.image = reader.result;
    };

  }

}
