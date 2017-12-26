import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  } from 'string-mask';

/**
 * Generated class for the KeyboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-keyboard',
  templateUrl: 'keyboard.html',
})
export class KeyboardPage {

  numbers: Array<{value:any, icon:string}>;
  billingValue:string = "0,00";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.billingValue = navParams.get('billingValue');
    this.numbers = [
      {value:1, icon:""},
      {value:2, icon:""},
      {value:3, icon:""},
      {value:4, icon:""},
      {value:5, icon:""},
      {value:6, icon:""},
      {value:7, icon:""},
      {value:8, icon:""},
      {value:9, icon:""},
      {value:"C", icon:""},
      {value:0, icon:""},
      {value:"", icon:"backspace"}
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KeyboardPage');
  }

  pressedButton(buttonValue: string) {
    
    console.log(buttonValue);
  }

}
