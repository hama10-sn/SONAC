import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransfertDataService {

  tab: Array<any> = new Array<any>();
  private code;
  private data;

  setData(data){
    this.data = data;
  }

  getData(){
    let temp = this.data;
    this.clearData();
    return temp;
  }

  clearData(){
    this.data = undefined;
  }

  setDataWithCode(code,data){
    this.code = code;
    this.data = data;
  }

  getDataWithCode(){
    let tmpCode = this.code;
    let tmpData = this.data;
    this.clearDataWithCode();

    this.tab[0] = tmpCode;
    this.tab[1] = tmpData;
    return this.tab;
  }

  clearDataWithCode(){
    this.code = undefined;
    this.data = undefined;
  }





  }
