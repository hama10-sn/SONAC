import { Component, OnInit } from '@angular/core';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { RdvService } from '../../../../services/rdv.service';
import 'ckeditor';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'ngx-add-document-sinistre',
  templateUrl: './add-document-sinistre.component.html',
  styleUrls: ['./add-document-sinistre.component.scss']
})
export class AddDocumentSinistreComponent implements OnInit {

  addForm = this.fb.group({

    document: ['', [Validators.required]]
  });

  // position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  // statusSuccess: NbComponentStatus = 'success';
  // statusFail: NbComponentStatus = 'danger';

  listDocuments: String[] = [];
  taille: number
  documentDejaDansListe: boolean = false;
  documentFinale = "";
  separateurDocument: string = "_$_";

  constructor(
    private transfertData: TransfertDataService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    let sinistre = this.transfertData.getData();
    console.log(sinistre);
  }

  onAddDocument() {

    const index: number = this.listDocuments.indexOf(this.addForm.get("document").value);

    if (index == -1) {
      this.listDocuments.push(this.addForm.get("document").value)
      this.addForm.controls['document'].setValue("");
      this.documentDejaDansListe = false;
    } else {
      this.documentDejaDansListe = true;
    }
  }

  onDeleteDocument(doc) {
    const index: number = this.listDocuments.indexOf(doc);
    if (index !== -1) {
      this.listDocuments.splice(index, 1);
    }
  }

  onValiderDocument() {
    console.log(this.listDocuments);

    this.documentFinale = "";
    for (let i = 0; i < this.listDocuments.length; i++) {
      this.documentFinale += this.listDocuments[i] + this.separateurDocument;
    }

    console.log(this.documentFinale);
  }

  cancel() {
    this.router.navigateByUrl('home/gestion-sinistre/liste-sinistre');
  }

}
