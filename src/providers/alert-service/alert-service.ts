import { LoadingController, MenuController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/*
  Generated class for the AlertServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertServiceProvider {

  loading: any;

  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private menuCtrl: MenuController,
    public alertCtrl: AlertController
  ) {
    console.log('Hello AlertServiceProvider Provider');
  }

  showLoader(message) {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  enableMenu(state, name) {
    this.menuCtrl.enable(state, name);
  }

  public menuIsEnabled(menuId): boolean {
    return this.menuCtrl.isEnabled(menuId);
  }

}
