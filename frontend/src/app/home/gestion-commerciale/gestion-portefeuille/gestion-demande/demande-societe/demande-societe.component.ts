import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Civilite } from '../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { Dem_Soc } from '../../../../../model/Dem_Soc';
import { CiviliteService } from '../../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { DemandesocieteService } from '../../../../../services/demandesociete.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { ClientService } from '../../../../../services/client.service';
import { Client } from '../../../../../model/Client';
//import type from '../../../../data/type.json';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Instruction } from '../../../../../model/Instruction';
import { InstructionService } from '../../../../../services/instruction.service';



@Component({
  selector: 'ngx-demande-societe',
  templateUrl: './demande-societe.component.html',
  styleUrls: ['./demande-societe.component.scss']
})
export class DemandeSocieteComponent implements OnInit {

  demandeSocietes: Array<Dem_Soc> = new Array<Dem_Soc>();
  demandeSociete: Dem_Soc;
  classificationSecteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  civilites: Array<Civilite> = new Array<Civilite>();

  listTypes: any [];
  //@Input() listTypeSocite:any [] = type;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['dem_socnum', 'dem_denomination', 'dem_typesociete', 'dem_nomprenomsdg',
        'dem_objetdemande','dem_registrecommerce','dem_statut','details'];
   public dataSource = new MatTableDataSource<Dem_Soc>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];

   constructor(private demSocService: DemandesocieteService,private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
     private authService: NbAuthService, private router: Router,
     private activeService: ClassificationSecteurService,private civiliteService: CiviliteService,
     private clientService: ClientService,
     private instructionService:InstructionService
     ) { }

     ngOnInit(): void {
      this.onGetAllDemandePhy();
      this.onGetAllCivilite();
      this.onGetClassification();
      this.onGetAllDemandeSoc();
      this.onGetAllInstruction()
      this.onGetAllInstructionByDemande("caution",72,"societe");
      this.onGetAllInstructionByDemandeTypeDemande(72,"societe");
      //this.listTypes=this.listTypeSocite['TYPE_SOCIETE'];

      this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
  
       if (token.isValid()) {
         this.autorisation = token.getPayload().fonctionnalite.split(',');
         console.log(this.autorisation);
       }
     });
   }
   onGetLibelleByType(numero: any) {
    
    return (this.listTypes?.find(p =>  p.id  === numero))?.value;

  
  }
   onGetAllDemandeSoc(){
    this.demSocService.getAllDemandeSociete()
    .subscribe((data: Dem_Soc[]) => {
        this.demandeSocietes = data;
        this.dataSource.data = data as Dem_Soc[];
        //console.log(this.demandePhysique);
    });  
   }
   onGetSecteurByCode(code:any){
    //console.log((this.classificationSecteurs.find(c => c.code === code))?.libelle );
   return  (this.classificationSecteurs.find(c => c.code === code))?.libelle ;       
 }
 onGetCiviliteByCode(code:number){
   //console.log((this.civilites.find(c => c.civ_code === code))?.civ_libellelong ); 
   return  (this.civilites.find(c => c.civ_code === code))?.civ_libellelong ;  
 }
   onGetAllCivilite(){
    this.civiliteService.getAllCivilite()
      .subscribe((data: Civilite[]) => {
          this.civilites = data;
      });
  }
  onGetClassification(){
    this.activeService.getAllGroupes()
    .subscribe((data: ClassificationSecteur[]) => {
      this.classificationSecteurs = data;
    });
  }
  openPresEmmission() {

    this.router.navigateByUrl('/home/demande-Societe/liste-demande-valide');
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
      open(dialog: TemplateRef<any>, demandeSoc:Dem_Soc ) {
        this.ongetFiles(demandeSoc);
        this.getCientById(demandeSoc.dem_clienttitulaire);
        setTimeout(() => {
          this.dialogService.open(
            dialog,
            {
              context: demandeSoc,  
            });
        }, 1000);
      }
  
      
    /*
      *cette methode nous permet d'ouvrir une 
      * inserer une demande 
      */
    openAjout() {
      
      this.router.navigateByUrl('/home/demande-societe/ajout-Societe');
    }
    /*
      *cette methode nous permet d'ouvrir une 
      *boite dialogue pour modifier un reassureur     
      */
    openModif(demande: Dem_Soc) {
      this.transfertData.setData(demande);
      this.router.navigateByUrl('/home/demande-societe/modif-Societe');
    }
    
    check_fonct(fonct: String) {
  
      let el = this.autorisation.findIndex(itm => itm === fonct);
      if (el === -1)
       return false;
      else
       return true;
  
    }
    onDeleteDemande(id: number) { 

      this.demSocService.deleteDemandeSociete(id)
      .subscribe((data) => {
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
          this.onGetAllDemandeSoc();
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
        onChechId(id: number) {

          if (id == null) {
      
            return 3;
          }
          if (this.demandeSocietes.find(p => p.dem_statut === "en attente" && p.dem_socnum=== id)) {
            return 1;
          } else {
            return 2;
          }
        }

    filenames: string[];
    ongetFiles(demande: Dem_Soc) {
      this.demSocService.getFilesDoc(demande.dem_socnum)
          .subscribe(data => this.filenames = data as string[]);
    }
    client: Client;
    getCientById(id) {
      this.clientService.getClient(id)
        .subscribe((data: any) => {
          this.client = data;
          //alert(JSON.stringify(this.client))
          //this.dataSource.data = data as Client[];
          //console.log(this.demandePhysique);
        });
    }
   
    onGetAllDemandePhy() {
      this.demSocService.getAllDemandeSociete()
        .subscribe((data: Dem_Soc[]) => {
          this.demandeSocietes = data.reverse();
          this.dataSource.data = data as Dem_Soc[];
          //console.log(this.demandePhysique);
        });
    }

    ngModelValue;
    message: any;
    openModif1(demande: Dem_Soc) {
      //demande.dem_commentaire = this.dem_commentaire;
      if (this.ngModelValue == '1') {
        demande.dem_statut = "validé";
      } else if (this.ngModelValue == '2') {
        demande.dem_statut = "Rejeté";
      }
      //alert(demande.dem_statut);
  
      //this.transfertData.setData(demande);
      this.demSocService.update(demande).subscribe(data => {
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
    // deb
    displayButtonUpload:boolean=false;
    openAjoutUpLoad() {
      this.displayButtonUpload =true;
    }
    selectedFile = null;
  onFileSelected(event) {
    this.selectedFile = event.target.files;
    console.log(this.selectedFile);
  }
  checked1 = false;
  checked2 = false;
  checked3 = false;
  checked4 = false;
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
  files: File[]
  onClickUpload(idDemande) {
    //this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for (const file of this.files) {
      form.append('files', file, file.name);
    }
  this.demSocService.uploadDoc(form, idDemande)
  .subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request has been made!');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Response header has been received!');
        break;
      case HttpEventType.UploadProgress:
        //this.progress = Math.round(event.loaded / event.total * 100);
        //console.log(`Uploaded! ${this.progress}%`);
        break;
      case HttpEventType.Response:
        console.log('upload ok', event.status);
        setTimeout(() => {
          //this.progress = 0;
          //this.displayprogress = false;
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
//fin
  
    onClickDownload(filename: string, idDemande) {
      console.log(idDemande);
  
      this.demSocService.downloadDoc(filename, idDemande)
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
  

    onExportConditionGenerale(id:any) {

      // this.clientService.generateReportClient(format, title, this.demandeur)
      this.demSocService.generateReportConditionGenerale(id)
  
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

    progress: number = 0;
  displayprogress: boolean = false;
  onClickDelete(filename: string,idDemande) {
    this.demSocService.deleteFileDoc(filename, idDemande)
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


    onExportConditionParticuliere(id) {

      // this.clientService.generateReportClient(format, title, this.demandeur)
      this.demSocService.generateReportConditionParticuliere(id)
    
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


    onExportGarantie(id) {

      // this.clientService.generateReportClient(format, title, this.demandeur)
      this.demSocService.generateReportSoumission(id)

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


  openDialogParticulier(dialogModifCParticulier: TemplateRef<any>, demandeSoc: Dem_Soc) {
    //alert(JSON.stringify(demandePhy));
    //console.log(demandePhy.dem_typetitulaire);
    //this.ongetFiles(demandePhy);
   // this.getCientById(demandePhy.dem_typetitulaire);
    setTimeout(() => {
      this.dialogService.open(
        dialogModifCParticulier,
        {
          context: demandeSoc,  
        });
    }, 1000);
   
  }


  refresh(){
    setTimeout(() => {
      this.onGetAllDemandePhy();
  
    }, 2000);
  }
  openArbitrage(demande: Dem_Soc) {

    this.transfertData.setData(demande);
    console.log(demande);
    this.router.navigateByUrl('/home/demande-Societe/arbitrage-Societe');

  }

  openPolice(demande: Dem_Soc) {

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
