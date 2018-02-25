import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ReceiptPage } from '../receipt/receipt';

/**
 * Generated class for the ExtractPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-extract',
  templateUrl: 'extract.html',
})
export class ExtractPage {

  operations: {} = new Array;
  numberOperations: number = 10;
  operationType: string = "finalized";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public alertProvider: AlertServiceProvider,
    public modalCtrl: ModalController
  ) {
  }

  ionViewWillEnter() {
    this.getOperations();
  }

  getOperations() {
    this.authService.getLatestOperations(this.numberOperations).then((result) => {
      this.operations = result;
    }, (err) => {
      this.alertProvider.presentToast(err);
    });
  }

  ionViewDidLoad() {
  }

  openDetail(operation) {
    let alert = this.alertProvider.alertCtrl.create({
      title: 'Datalhes',
      message: `
          <h6>Data: ` + operation.TransactionDate + `</h6>
          <h6>Operação: ` + operation.Operation + `</h6>
          <h6>De: ` + operation.IdFrom + `</h6>
          <h6>Para: ` + operation.IdTo + `</h6>
          <h6>Valor: ` + operation.Value + `</h6>
          <h6>Situação: ` + operation.Status + `</h6>
          <h6>Identificador: ` + operation.Identifier + `</h6>
          `,
      buttons: [
        {
          text: 'Fechar',
          handler: () => {
            
          }
        },
        {
          text: 'Comprovante',
          handler: () => {
            let receiptModal = this.modalCtrl.create(ReceiptPage, {identifier:operation.Identifier}); 
            receiptModal.present();
            this.alertProvider.showLoader('Preparando recibo...');
          }
        }
      ]
    });
    alert.present();
  }

}
