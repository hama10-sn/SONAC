import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Civilite } from '../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { Dem_Pers } from '../../../../../model/dem_Pers';
import { CiviliteService } from '../../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { DemandephysiqueService } from '../../../../../services/demandephysique.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { saveAs } from 'file-saver';
import { ClientService } from '../../../../../services/client.service';
import { Client } from '../../../../../model/Client';
import { Instruction } from '../../../../../model/Instruction';
import { InstructionService } from '../../../../../services/instruction.service';

@Component({
  selector: 'ngx-demande-physique',
  templateUrl: './demande-physique.component.html',
  styleUrls: ['./demande-physique.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class DemandePhysiqueComponent implements OnInit {
  ngModelValue;
  dem_commentaire;
  dem_commentaire2;
  formControl = new FormControl('1');
  client: Client;
  docForm = this.fb.group({
    dem_document1: ['', [Validators.required]],
    dem_document2: ['', [Validators.required]],
    dem_document3: ['', [Validators.required]],
    dem_document4: ['', [Validators.required]],
  });
  modifForm = this.fb.group({
    dem_ca: [],
    dem_cs: [],
    dem_clientId: [''],

  });

  demandePhysiques: Array<Dem_Pers> = new Array<Dem_Pers>();
  demandePhysique: Dem_Pers;
  checked1 = false;
  checked2 = false;
  checked3 = false;
  checked4 = false;

  filenames: string[];

  toggle1(checked: boolean) {
    this.checked1 = checked;
  }
  toggle2(checked: boolean) {
    this.checked2 = checked;
  }

  toggle3(checked: boolean) {
    this.checked3 = checked;
  }
  toggle4(checked: boolean) {
    this.checked4 = checked;
  }
  verifierCheck() {
    if (this.checked1 && this.checked2 && this.checked3 && this.checked4) {
      return true
    } else
      return false;
  }

  classificationSecteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  civilites: Array<Civilite> = new Array<Civilite>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['dem_persnum', 'dem_typeclientpers','dem_typetitulaire', 'dem_nom', 'dem_prenom',
    'dem_adresse1', 'dem_objetdemande', 'dem_statut', 'action'];
  // public displayedColumns = ['dem_persnum', 'dem_typeclientpers', 'dem_nom', 'dem_prenom',
  // 'dem_adresse1','dem_objetdemande','dem_statut','details', 'delete','action'];
  public dataSource = new MatTableDataSource<Dem_Pers>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];
  message: any;
  constructor(private demPService: DemandephysiqueService, private transfertData: TransfertDataService,
    private dialogService: NbDialogService, private civiliteService: CiviliteService,
    private authService: NbAuthService, private router: Router, private fb: FormBuilder,
    private clientService: ClientService,
    private activiteService: ClassificationSecteurService, private toastrService: NbToastrService,
    private instructionService:InstructionService) { }


    
  ngOnInit(): void {
    this.form = this.fb.group({
      acceptTerms: [false, Validators.requiredTrue],
      acceptTerms1: [false, Validators.requiredTrue]
  });
    
    this.onGetAllCivilite();
    this.onGetClassification();
    this.onGetAllDemandePhy();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);
        }
      });
  }
  onGetAllDemandePhy() {
    this.demPService.getAllDemandePhysique()
      .subscribe((data: Dem_Pers[]) => {
        //this.demandePhysiques = data.reverse();
        this.demandePhysiques = data;
        this.dataSource.data = data as Dem_Pers[];
        //console.log(this.demandePhysique);
      });
  }

  openPresEmmission() {

    this.router.navigateByUrl('/home/demande-Physique/liste-demande-valide');
  }
  getCientById(id) {
    this.clientService.getClient(id)
      .subscribe((data: any) => {
        this.client = data;
        //alert(JSON.stringify(this.client))
        //this.dataSource.data = data as Client[];
        //console.log(this.demandePhysique);
      });
  }
  onGetAllCivilite() {
    this.civiliteService.getAllCivilite()
      .subscribe((data: Civilite[]) => {
        this.civilites = data;
      });
  }
  onGetClassification() {
    this.activiteService.getAllGroupes()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classificationSecteurs = data;
      });
  }

  onGetSecteurByCode(code: number) {
    //console.log((this.classificationSecteurs.find(c => c.code === code))?.libelle );
    return (this.classificationSecteurs.find(c => c.code === code))?.libelle;
  }
  onGetCiviliteByCode(code: number) {
    //console.log((this.civilites.find(c => c.civ_code === code))?.civ_libellelong ); 
    return (this.civilites.find(c => c.civ_code === code))?.civ_libellelong;
  }

  /*
    cette methode nous permet de faire des paginations
    */
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  /*
    cette methode nous permet de faire des filtre au niveau 
    de la recherche dans la liste
    */
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  /*
    *cette methode nous permet d'ouvrir une boite dialogue
    */
  open(dialog: TemplateRef<any>, demandePhy: Dem_Pers) {
    //alert(JSON.stringify(demandePhy));
    //console.log(demandePhy.dem_typetitulaire);
    this.ongetFiles(demandePhy.dem_persnum);
    this.getCientById(demandePhy.dem_typetitulaire);
    setTimeout(() => {
      this.dialogService.open(
        dialog,
        {
          context: demandePhy,  
        });
    }, 1000);
   
  }

  openDialogParticulier(dialogModifCParticulier: TemplateRef<any>, demandePhy: Dem_Pers) {
    //alert(JSON.stringify(demandePhy));
    //console.log(demandePhy.dem_typetitulaire);
    //this.ongetFiles(demandePhy);
   // this.getCientById(demandePhy.dem_typetitulaire);
    setTimeout(() => {
      this.dialogService.open(
        dialogModifCParticulier,
        {
          context: demandePhy,  
        });
    }, 1000);
   
  }
  // dem_typetitulaire
  openClient(dialog360: TemplateRef<any>, clientId: any) {
    this.getCientById(clientId);
    setTimeout(() => {
      this.dialogService.open(
        dialog360,
        {
          context: this.client,
        });
    }, 2000);


  }


  /*
    *cette methode nous permet d'ouvrir une 
    * inserer un reassureur 
    */
  openAjout() {

    this.router.navigateByUrl('home/demande-Physique/ajout-Physique');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un reassureur     
    */
  openModif(demande: Dem_Pers) {
    demande.dem_commentaire = this.dem_commentaire;
    demande.dem_commentaire2 = this.dem_commentaire2;
    if (this.ngModelValue == '1') {
      demande.dem_statut = "validé";
    } else if (this.ngModelValue == '2') {
      demande.dem_statut = "Rejeté";
    }
    //alert(demande.dem_statut);

    //this.transfertData.setData(demande);
    this.demPService.update(demande).subscribe(data => {
      if (this.ngModelValue == '1') {
        this.message = "Demande validée avec succes !";
      } else if (this.ngModelValue == '2') {
        this.message = "Demande rejetée avec succes !";
      }
      this.toastrService.show(
        this.message,
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
      this.onGetAllDemandePhy();
    },
      (error) => {
        this.toastrService.show(
          'Impossible de supprimer la demande !',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
      })
  }

  onDeleteDemande(id: number) {

    this.demPService.deleteDemande(id).subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Demande Supprimer avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
      this.onGetAllDemandePhy();
    },
      (error) => {
        this.toastrService.show(
          'Impossible de supprimer demande rattachée à un affaire !',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
      },
    );
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }
  onChechId(id: number) {

    if (id == null) {

      return 3;
    }
    if (this.demandePhysiques.find(p => p.dem_statut === "en attente" && p.dem_persnum === id)) {
      return 1;
    } else {
      return 2;
    }
  }
  ongetFiles(dem_persnum) {
    this.demPService.getFilesDoc(dem_persnum)
      .subscribe(data => this.filenames = data as string[]);
  }


  onClickDownload(filename: string, idDemande) {
    console.log(idDemande);

    this.demPService.downloadDoc(filename, idDemande)
      .subscribe(event => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          // case HttpEventType.UploadProgress:
          //   this.progress = Math.round(event.loaded / event.total * 100);
          //   console.log(`downloaded! ${this.progress}%`);
          //   break;
          case HttpEventType.Response:
            console.log(event.body);
            saveAs(event.body, filename);
        }
      });
  }


  onExportGarantie(id) {

      // this.clientService.generateReportClient(format, title, this.demandeur)
      this.demPService.generateReportSoumission(id)

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
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'Garantie de soumission.pdf');
          }
        });
    

  
  }

  onExportConditionGenerale(id:any) {

    // this.clientService.generateReportClient(format, title, this.demandeur)
    this.demPService.generateReportConditionGenerale(id)

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
            // console.log(event);
            // var fileURL = URL.createObjectURL(event.body) ;
            // window.open(fileURL) ;
            saveAs(event.body, 'Condition Générale.pdf');
        }
      });
  


}
onExportConditionParticuliere(id) {

  // this.clientService.generateReportClient(format, title, this.demandeur)
  this.demPService.generateReportConditionParticuliere(id)

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
          // console.log(event);
          // var fileURL = URL.createObjectURL(event.body) ;
          // window.open(fileURL) ;
          saveAs(event.body, 'Condition Particulière.pdf');
      }
    });
}

openModifInfo(client){
//alert(JSON.stringify(client));
this.clientService.modifClientById(client.dem_typetitulaire,this.modifForm.value.dem_ca,this.modifForm.value.dem_cs).subscribe((data:any)=>{
 // alert(JSON.stringify(data));
  this.toastrService.show(
    data.message,
    {
      status: this.statusSuccess,
      destroyByClick: true,
      duration: 30000,
      hasIcon: true,
      position: this.position,
      preventDuplicates: false,
    });

})
this.onGetAllDemandePhy();

}
refresh(){
  setTimeout(() => {
    this.onGetAllDemandePhy();

  }, 2000);
}
form: FormGroup;
submitted = false;
// convenience getter for easy access to form fields
get f() { return this.form.controls; }


checked = false;

  toggle(checked: boolean) {
    this.checked = checked;
    if(this.checked==true && this.checkeddeux==true){
      this.check=true;
    }else{
      this.check=false;
    }
  }
  check:boolean=false;
  checkeddeux
  toggledeux(checked: boolean) {
    this.checkeddeux = checked;
    if(this.checked==true && this.checkeddeux==true){
      this.check=true;
    }else{
      this.check=false;
    }

  }
  displayButtonUpload:boolean=false;
  openAjoutUpLoad() {
    this.displayButtonUpload =true;
  }
  selectedFile = null;
  onFileSelected(event) {
    this.selectedFile = event.target.files;
    console.log(this.selectedFile);
  }
  
  files: File[]
  onClickUpload(idDemande) {
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for (const file of this.files) {
      form.append('files', file, file.name);
    }

    this.demPService.uploadDoc(form, idDemande)
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
              this.ongetFiles(idDemande);
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
  progress: number = 0;
  displayprogress: boolean = false;
  onClickDelete(filename: string,idDemande) {
    this.demPService.deleteFileDoc(filename, idDemande)
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

            if (event.status == 200) {
              this.ongetFiles(idDemande);
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

  openArbitrage(demande: any) {

    this.transfertData.setData(demande);
    console.log(demande);
    this.router.navigateByUrl('/home/demande-Physique/arbitrage-Physique');

  }
  openPolice(demande: Dem_Pers) {



    this.transfertData.setData(demande);

    console.log(demande);

    this.router.navigateByUrl('home/parametrage-production/police/ajout');



  }

  instructions: Instruction[]
  onGetAllInstruction(){
    this.instructionService.getAllInstruction()
    .subscribe((data1: Instruction[]) => {
        this.instructions = data1;
        //this.dataSource1.data = data1 as Instruction[];
        console.log("instructions",this.instructions);
    });  
   }
   instructionBydemande : Instruction[];
   onGetAllInstructionByDemande(typeinstruct,demande,typedmande){
    this.instructionService.getAllInstructionByDemande(typeinstruct,demande,typedmande)
    .subscribe((data: Instruction[]) => {
        this.instructionBydemande= data;
        //this.dataSource1.data = data1 as Instruction[];
        console.log("instructionBydemande",this.instructionBydemande);
    });  
   }

   instructionByDemandeTypeDemande: Instruction[];
   onGetAllInstructionByDemandeTypeDemande(demande,typedmande){
    this.instructionService.getAllInstructionByDemandeTypeDemande(demande,typedmande)
    .subscribe((data: Instruction[]) => {
        this.instructionByDemandeTypeDemande= data;
        //this.dataSource1.data = data1 as Instruction[];
        console.log("instructionByDemandeTypeDemande",this.instructionByDemandeTypeDemande);
    });  
   }

   goToAllInstructByDemandeTypeDemande(demande,typeDemande,numDemande){
    let data=[demande,typeDemande,numDemande]
    
    this.transfertData.setData(data);
      this.router.navigateByUrl('/home/demande-Instruction');
   }
  
}
