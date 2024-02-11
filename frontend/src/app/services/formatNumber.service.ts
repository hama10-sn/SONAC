import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatNumberService {

  replaceAll(str, find, replace) {
    if (str == null)
      return null;
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
  }
  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
  }

  numberWithCommas2(x) {
    var parts = x.toString().split(" ");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(" ");
}

}
