import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import StringMask from 'string-mask';
import { ViewController } from 'ionic-angular/navigation/view-controller';

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

  formatter = new StringMask('#.##0,00', {reverse: true});
  numbers: Array<{value:any, icon:string}>;
  showBillingValue:String = "";
  rawBillingValue:String = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl:ViewController
  ) {
    this.showBillingValue = this.formatter.apply(navParams.get('billingValue'));
    if(this.showBillingValue == "")
      this.showBillingValue = "0,00"
    this.rawBillingValue = navParams.get('billingValue');
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
    if(buttonValue == "C") {
      this.rawBillingValue = "";
      this.showBillingValue = "0,00";
      console.log(buttonValue);
    } else if(buttonValue === "") {
      this.rawBillingValue = this.rawBillingValue.substring(0, this.rawBillingValue.length - 1);
      this.showBillingValue = this.formatter.apply(this.rawBillingValue);
      console.log(buttonValue);
    } else {
      this.rawBillingValue = this.rawBillingValue.concat(buttonValue);
      this.showBillingValue = this.formatter.apply(this.rawBillingValue);
      console.log(this.rawBillingValue);
    }
  }

  dismiss() {
    let data = this.rawBillingValue;
    this.viewCtrl.dismiss(data);
  }

}
