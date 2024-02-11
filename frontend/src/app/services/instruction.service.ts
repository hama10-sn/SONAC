import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Instruction } from '../model/Instruction';

// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
} ; 
@Injectable({
  providedIn: 'root'
})
export class InstructionService {

  apiRoot: string ;

  constructor(private httpClient: HttpClient) { 
      this.apiRoot = environment.apiUrl ;
  }

  getAllInstruction(): Observable<Instruction[]> {
    return this.httpClient.get<Instruction[]>(`${this.apiRoot}/instruction/allInstruct`) ;
  }
  getInstructionById(numInstruct) {
    return this.httpClient.get(`${this.apiRoot}/instruction/instruct/${numInstruct}`) ;
  }
  addInstruction(instruction: Instruction): Observable<Instruction> {
    return this.httpClient.post<Instruction>(`${this.apiRoot}/instruction/addInstruct`, instruction, httpOptions);
  }
  updateInstruction(instruction: Instruction) {
    return this.httpClient.put<Instruction>(`${this.apiRoot}/instruction/update`, instruction, httpOptions) ;
  } 
  DeleteInstruction(numInstruct: Number) {
    return this.httpClient.get(`${this.apiRoot}/instruction/delete/${numInstruct}`);
  }

  getAllInstructionByDemande(typeinstruct:string,demande:number,typedmande:string): Observable<Instruction[]> {
    return this.httpClient.get<Instruction[]>(`${this.apiRoot}/instruction/instructAll/${typeinstruct}/${demande}/${typedmande}`) ;
  }

  getAllInstructionByDemandeTypeDemande(demande:number,typedmande:string): Observable<Instruction[]> {
    return this.httpClient.get<Instruction[]>(`${this.apiRoot}/instruction/instructAllByD/${demande}/${typedmande}`) ;
  }
} 
