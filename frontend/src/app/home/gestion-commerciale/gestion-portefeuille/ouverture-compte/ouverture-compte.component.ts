import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Fonctionnalite } from '../../../../model/Fonctionnalite';
import { Role } from '../../../../model/Role';
import { FonctionnaliteService } from '../../../../services/fonctionnalite.service';
import { ProspectService } from '../../../../services/prospect.service';
import { RoleService } from '../../../../services/role.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UploadService } from '../../../../services/upload.service';
import { saveAs } from 'file-saver';
import { AjoutFonctionnaliteComponent } from '../../../gestion-utilisateur/gestion_role/fonctionnalite/ajout-fonctionnalite/ajout-fonctionnalite.component';
import { ModifFonctionnaliteComponent } from '../../../gestion-utilisateur/gestion_role/fonctionnalite/modif-fonctionnalite/modif-fonctionnalite.component';
import { Prospect } from '../../../../model/Prospect';
import { Dem_Pers } from '../../../../model/dem_Pers';
import { Dem_Soc } from '../../../../model/Dem_Soc';
import { DemandesocieteService } from '../../../../services/demandesociete.service';
import { DemandephysiqueService } from '../../../../services/demandephysique.service';

@Component({
  selector: 'ngx-ouverture-compte',
  templateUrl: './ouverture-compte.component.html',
  styleUrls: ['./ouverture-compte.component.scss']
})
export class OuvertureCompteComponent implements OnInit {

  public displayedColumns = ['demande', 'doc', 'reference', 'cv', 'cni', 'bilan', 'releve'];

  fonctionnalites: Array<Fonctionnalite> = new Array<Fonctionnalite>();
  fonctionnalite: Fonctionnalite;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  tableau_fonctionnalite = [];
  tab = [];
  donnee: Role;
  name_role: any;
  autorisations = [];
demandePHy : Dem_Pers;
demandeSos: Dem_Soc;

  displayInfoAdmin: boolean = false;
  display: boolean = false;
  displayDemande: boolean = false;
  displayContrats: boolean = false;
  displayFinanciers: boolean = false;
  displayClient: boolean = false;
  displayAutre: boolean = false;
  displayTeleClient: boolean = false;
  files: File[];
  selectedFile = null;
  progress: number = 0;
  displayprogress: boolean = false;
  displayUpload: boolean = false;
  numero_prospect: any;
  prospect: Prospect;
  public dataSource = new MatTableDataSource<Fonctionnalite>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  checked1 :boolean = false;
  checked2 :boolean= false;
  checked3 :boolean= false;
  checked4 :boolean= false;
  checked :boolean = false;
  getted :boolean = false;

  displayButtonUpload: boolean = false;
  //displayprogress: boolean = false;
  //selectedFile = null;
  //files: File[];
  //progress: number = 0;
  filenames: string[];

  // status: NbComponentStatus = 'info';

  constructor(private fonctionnaliteService: FonctionnaliteService, private transfertData: TransfertDataService,
    private dialogService: NbDialogService, private roleService: RoleService, private router: Router,
    private toastrService: NbToastrService, private authService: NbAuthService, private prospectService : ProspectService,
    private uploadService: UploadService, private demandesocService: DemandesocieteService,
    private demandephyService: DemandephysiqueService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisations = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisations);
      }

    });
    this.prospect= this.transfertData.getData();
    console.log(this.prospect.prospc_numero);
   

    this.ongetFiles(this.prospect.prospc_numero);
    if(this.prospect.prospc_nature="1"){
      
  console.log('test--',this.demandePHy?.list_document_valide);
  if(this.demandePHy?.list_document_valide[31]==32){
    this.checked=true
  }else{
    this.checked=false;
  }
  if(this.demandePHy?.list_document_valide[32]==33){
    this.checkeddeux=true;
  }else{
    this.checkeddeux=false
  }
  if(this.demandePHy?.list_document_valide[33]==34){
    this.checkedtrois=true;
  }else{
    this.checkedtrois=false
  }
  if(this.demandePHy?.list_document_valide[34]==35){
    this.checkedquatre=true;
  }else{
    this.checkedquatre=false
  }
  if(this.demandePHy?.list_document_valide[35]==36){
    this.checkedcinq=true;
  }else{
    this.checkedcinq=false
  }
  
  if(this.demandePHy?.list_document_valide[36]==37){
    this.checkedsix=true;
  }else{
    this.checkedsix=false
  } 
   
  if(this.demandePHy?.list_document_valide[37]==38){
    this.checkedsept=true;
  }else{
    this.checkedsept=false
  } 
  if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
    this.check=true;
    this.getted=true
  }else{
    this.check=false;
    this.getted=false
  }
  
if(this.demandePHy!=null ){
    this.ongetFiles(this.demandePHy.dem_persnum)
 }
    }else{
  console.log('test--',this.prospect?.list_document_valide);
  if(this.prospect?.list_document_valide[31]==32){
    this.checked=true
  }else{
    this.checked=false;
  }
  if(this.prospect?.list_document_valide[32]==33){
    this.checkeddeux=true;
  }else{
    this.checkeddeux=false
  }
  if(this.prospect?.list_document_valide[33]==34){
    this.checkedtrois=true;
  }else{
    this.checkedtrois=false
  }
  if(this.prospect?.list_document_valide[34]==35){
    this.checkedquatre=true;
  }else{
    this.checkedquatre=false
  }
  if(this.prospect?.list_document_valide[35]==36){
    this.checkedcinq=true;
  }else{
    this.checkedcinq=false
  }
  
  if(this.prospect?.list_document_valide[36]==37){
    this.checkedsix=true;
  }else{
    this.checkedsix=false
  } 
   
  if(this.prospect?.list_document_valide[37]==38){
    this.checkedsept=true;
  }else{
    this.checkedsept=false
  } 
  if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
    this.check=true;
    this.getted=true
  }else{
    this.check=false;
    this.getted=false
  }
  
if(this.prospect!=null ){
    this.ongetFiles(this.prospect.prospc_numero)
 }
}
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllFonctionnalites() {
    this.fonctionnaliteService.getAllFonctionnalites()
      .subscribe((data: Fonctionnalite[]) => {
          this.fonctionnalites = data;
          this.dataSource.data = data as Fonctionnalite[];
          console.log(this.fonctionnalites);
      });
  }

  onDeleteFonctionnalite(id: number) {
    this.fonctionnaliteService.deleteFonctionnalite(id)
      .subscribe(() => {
        this.toastrService.show(
          'Fonctionnalite supprimer avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

          this.onGetAllFonctionnalites();
      });
  }
  openAjoutUpLoad() {
    this.displayButtonUpload =true;
  }
  open(dialog: TemplateRef<any>, fonctionnalite: Fonctionnalite) {
    this.dialogService.open(
      dialog,
      { context: fonctionnalite });
       console.log(this.fonctionnalites);
  }

  
  toggle(checked: boolean) {
    this.checked = checked;
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
    }else{
      this.check=false;
    }
  }
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
 
  check:boolean=false;
  checkeddeux
  toggledeux(checked: boolean) {
    this.checkeddeux = checked;
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
    }else{
      this.check=false;
    }

  }
  
  checkedtrois:boolean = false
  toggletrois(checked: boolean) {
    this.checkedtrois = checked;
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
    }else{
      this.check=false;
    }

  }
  
  checkedquatre :boolean = false
  togglequatre(checked: boolean) {
    this.checkedquatre = checked;
    

  } 
  
  checkedcinq :boolean = false
  togglecinq(checked: boolean) {
    this.checkedcinq = checked;
    

  } 
  
  checkedsix :boolean = false
  togglesix(checked: boolean) {
    this.checkedsix = checked;
    

  }
  checkedsept :boolean = false
  togglesept(checked: boolean) {
    this.checkedsept = checked;
    

  }  
  /* 
  checkedquatre :boolean = false
  togglequatre(checked: boolean) {
    this.checkedquatre = checked;
    

  } */
  openAjout() {
    this.dialogService.open(AjoutFonctionnaliteComponent)
    .onClose.subscribe(data => data && this.fonctionnaliteService.addFonctionnalite(data)
    .subscribe(() => {
      this.toastrService.show(
        'Fonctionnalite Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllFonctionnalites();
    },
    (error) => {
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllFonctionnalites();
    },
    ));
  }

  openModif(fonctionnalite: Fonctionnalite, id: Number) {
    this.dialogService.open(ModifFonctionnaliteComponent, {
        context: {
          fonctionnalite: fonctionnalite,
        },
      })
    .onClose.subscribe(data => data && this.fonctionnaliteService.updateFonctionnalites(data, id)
    .subscribe(() => {
      this.toastrService.show(
        'Utilisateur modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllFonctionnalites();
    },
      (error) => {
        console.log(error);
        this.toastrService.show(
          'une erreur est survenue',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.onGetAllFonctionnalites();
      },
    ));
  }

  onSelection_fonctionnalite(e, data) {

    if (e.target.checked) {
      this.tab.push(data);
    } else {

       let el = this.tab.findIndex(itm => itm === data);
        this.tab.splice((el), 1);
      // this.tableau_fonctionnalite.pop();
       console.log(el);
    }
    console.log(this.tab);

  }
  /* onCLickUpload () {
    this.displayInfoAdmin = false;
    this.displayDemande = false;
    this.displayContrats = false;
    this.displayFinanciers = false;
    this.displayClient = false;
    this.displayAutre = false;
    this.displayTeleClient = false;
    this.displayUpload = true;
    } */

  /* onClickUpload () {
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for(const file of this.files) {
      form.append('files', file, file.name);
    } 

  this.uploadService.uploadInDossier(form,this.prospect.prospc_numero,'download')
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
  }*/
  listedoc : number []=[];
  onAjout(){

    
    if(this.prospect.prospc_nature="1"){//physique
      this.demandePHy.dem_typeclientpers= "PR";
      this.demandePHy.dem_typetitulaire=(this.prospect.prospc_numero).toString();
      this.demandePHy.dem_civilitepers=this.prospect.prospc_titre;
      this.demandePHy.dem_nom=this.prospect.prospc_nom;
      this.demandePHy.dem_prenom=this.prospect.prospc_prenom;
      this.demandePHy.dem_adresse1=this.prospect.prospc_adressenumero;
      this.demandePHy.dem_adresse2=this.prospect.prospc_adresserue;
      this.demandePHy.dem_ville=this.prospect.prospc_adresseville;
      this.demandePHy.dem_secteuractivites=Number(this.prospect.prospc_classificationmetier);
      this.demandePHy.dem_registrecommerce=this.prospect.prospc_registrecommerce;
      this.demandePHy.dem_ninea=this.prospect.prospc_ninea;
      this.demandePHy.dem_telephoneprincipal=this.prospect.prospc_telephone1;
      this.demandePHy.dem_telephone2=this.prospect.prospc_telephone2;
      this.demandePHy.dem_telephonemobile=this.prospect.prospc_portable;
      this.demandePHy.dem_email=this.prospect.prospc_email;
      this.demandePHy.dem_objetdemande="Ouverture compte";
      //this.demandePHy.dem_email=this.prospect.prospc_email;
      this.demandePHy.dem_statut="Compte Valider";
      
    this.checked ;
    if(this.checked){
      //this.form2.controls['dr'].setValue(1);
      this.listedoc[31]=32;
    }else{
      //this.form2.controls['dr'].setValue(null);
      this.listedoc[31]=null;
    }
    if(this.checkeddeux){
      //this.form2.controls['mc'].setValue(2);
      this.listedoc[32]=33;
    }else{
      //this.form2.controls['mc'].setValue(null);
      this.listedoc[32]= null;
    }
    if(this.checkedtrois){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[33]=34;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[33]=null;
    }
    if(this.checkedquatre){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[34]=35;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[34]=null;
    }
    if(this.checkedcinq){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[35]=36;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[35]=null;
    }
    if(this.checkedsix){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[36]=37;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[36]=null;
    }
    if(this.checkedsept){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[37]=38;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[37]=null;
    }
    console.log(this.listedoc);
    this.demandePHy.list_document_valide = this.listedoc;
   // this.prospect.prospc_typesociete;
    this.demandephyService.addDemandePhysiqu(this.demandePHy).subscribe(data => {
      
      //this.message="Documents cochés enregistrés avec success";
      this.toastrService.show(
        'ouverture compte enregistrés avec success',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('/home/gestion-commerciale/gestion-portefeuille/prospects');
    },
      (error) => {
        this.toastrService.show(
          'Impossible de enregistrer la demande !',
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
    
  
    }else{
      
      this.demandeSos.dem_typetitulaire= "PR";
      this.demandeSos.dem_typetitulaire=(this.prospect.prospc_numero).toString();
      this.demandeSos.dem_typesociete=Number(this.prospect.prospc_typesociete);
      this.demandeSos.dem_denomination=this.prospect.prospc_nom;
      this.demandeSos.dem_nomprenomsdg=this.prospect.prospc_princdirigeant;
      this.demandeSos.dem_adresse1=this.prospect.prospc_adressenumero;
      this.demandeSos.dem_adresse2=this.prospect.prospc_adresserue;
      this.demandeSos.dem_ville=this.prospect.prospc_adresseville;
      this.demandeSos.dem_secteuractivites=Number(this.prospect.prospc_classificationmetier);
      this.demandeSos.dem_registrecommerce=this.prospect.prospc_registrecommerce;
      this.demandeSos.dem_ninea=this.prospect.prospc_ninea;
      this.demandeSos.dem_telephoneprincipal=this.prospect.prospc_telephone1;
      this.demandeSos.dem_telephone2=this.prospect.prospc_telephone2;
      this.demandeSos.dem_telephonemobile=this.prospect.prospc_portable;
      //this.demandeSos.dem_email=this.prospect.prospc_email;
      this.demandeSos.dem_objetdemande="Ouverture compte";
      this.demandeSos.dem_siteinternet=this.prospect.prospc_website;
      this.demandeSos.dem_statut="Compte Valider";
    }

    
    this.checked ;
    if(this.checked){
      //this.form2.controls['dr'].setValue(1);
      this.listedoc[31]=32;
    }else{
      //this.form2.controls['dr'].setValue(null);
      this.listedoc[31]=null;
    }
    if(this.checkeddeux){
      //this.form2.controls['mc'].setValue(2);
      this.listedoc[32]=33;
    }else{
      //this.form2.controls['mc'].setValue(null);
      this.listedoc[32]= null;
    }
    if(this.checkedtrois){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[33]=34;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[33]=null;
    }
    if(this.checkedquatre){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[34]=35;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[34]=null;
    }
    if(this.checkedcinq){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[35]=36;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[35]=null;
    }
    if(this.checkedsix){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[36]=37;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[36]=null;
    }
    if(this.checkedsept){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[37]=38;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[37]=null;
    }
    console.log(this.listedoc);
    this.demandeSos.list_document_valide = this.listedoc;
    //this.prospect.prospc_typesociete;
    this.demandesocService.addDemandeSociete(this.demandeSos).subscribe(data => {
      
      //this.message="Documents cochés enregistrés avec success";
      this.toastrService.show(
        'ouverture compte enregistrés avec success',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('/home/gestion-commerciale/gestion-portefeuille/prospects');
    },
      (error) => {
        this.toastrService.show(
          'Impossible de enregistrer la demande !',
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

  ongetFiles(numero_prospect) {
    this.prospectService.getFilesDoc(numero_prospect)
      .subscribe(data => this.filenames = data as string[]);
  }
  ongetFilesPhy(numero_prospect) {
    this.demandephyService.getFilesDoc(numero_prospect)
      .subscribe(data => this.filenames = data as string[]);
  }
  ongetFilesSoc(numero_prospect) {
    this.demandesocService.getFilesDoc(numero_prospect)
      .subscribe(data => this.filenames = data as string[]);
  }
  
  onClickUpload() {
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for (const file of this.files) {
      form.append('files', file, file.name);
    }
console.log(this.prospect.prospc_numero);
if(this.prospect.prospc_nature="1"){
  this.demandephyService.uploadDoc(form, this.demandePHy)
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
          this.ongetFiles(this.prospect.prospc_numero);
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
            this.transfertData.setData(this.prospect.prospc_numero);
            this.router.navigateByUrl('home/gestion-prospect/ouverturecompte');
        
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

}else{
  this.prospectService.uploadDoc(form, this.prospect.prospc_numero)
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
          this.ongetFiles(this.prospect.prospc_numero);
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
            this.transfertData.setData(this.prospect.prospc_numero);
            this.router.navigateByUrl('home/gestion-prospect/ouverturecompte');
        
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
   /*  this.prospectService.uploadDoc(form, this.prospect.prospc_numero)
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
              this.ongetFiles(this.prospect.prospc_numero);
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
                this.transfertData.setData(this.prospect.prospc_numero);
                this.router.navigateByUrl('home/gestion-prospect/ouverturecompte');
            
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
 */

  }

  
  onClickDownload(filename: string) {
    console.log();

    this.prospectService.downloadDoc(filename, this.prospect.prospc_numero)
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

  
  onClickDelete(filename: string) {
    this.prospectService.deleteFileDoc(filename, this.prospect.prospc_numero)
      .subscribe(event => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            //this.progress = Math.round(event.loaded / event.total * 100);
            //console.log(`downloaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:

            if (event.status == 200) {
              this.ongetFiles(this.prospect.prospc_numero);
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
  onAnnuler() {
         
         this.router.navigateByUrl('home/gestion-commerciale/gestion-portefeuille/prospects');
    }

  check_fonct(fonct: String) {

    let el = this.tab.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }

  check_fonct21(fonct: String) {

    let el = this.autorisations.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
  onFileSelected (event) {
    this.selectedFile = event.target.files;
      console.log(this.selectedFile);
  }

  public redirectToUpdate = (id: string) => {

  }
  public redirectToDelete = (id: string) => {

  }

}
