import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CifrardescifrarService {

  constructor() { }

  // Declare this key and iv values in declaration
  private key = CryptoJS.enc.Utf8.parse('4512631236589784');
  private iv = CryptoJS.enc.Utf8.parse('4512631236589784');

  // Methods for the encrypt and decrypt Using AES
  encryptUsingAES256(cifrarAPI: string) {
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(cifrarAPI)), this.key, {
      keySize: 192 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted;
  }

  decryptUsingAES256(decString: string) {
    var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
      keySize: 192 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
