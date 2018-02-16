import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';


import { AboutPage } from '../pages/about/about';
import { ActivationPage } from '../pages/activation/activation';
import { CardPage } from '../pages/card/card';
import { HomePage } from '../pages/home/home';
import { KeyboardPage } from '../pages/keyboard/keyboard';
import { FAQPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TransferPage } from '../pages/transfer/transfer';
import { UserPage } from '../pages/user/user';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { MyApp } from './app.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BillingSmsPage } from '../pages/billing-sms/billing-sms';
//import { Directive } from 'ionic3-input-mask';
import { BillingIdentificationPage } from '../pages/billing-identification/billing-identification';
import { QRScanner } from '@ionic-native/qr-scanner';
import { ReceiptPage } from '../pages/receipt/receipt';
import { AboutPageModule } from '../pages/about/about.module';
import { ActivationPageModule } from '../pages/activation/activation.module';
import { BillingIdentificationPageModule } from '../pages/billing-identification/billing-identification.module';
import { BillingSmsPageModule } from '../pages/billing-sms/billing-sms.module';
import { CardPageModule } from '../pages/card/card.module';
import { KeyboardPageModule } from '../pages/keyboard/keyboard.module';
import { ReceiptPageModule } from '../pages/receipt/receipt.module';
import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { TransferPageModule } from '../pages/transfer/transfer.module';
import { UserPageModule } from '../pages/user/user.module';
import { HomePageModule } from '../pages/home/home.module';
import { CardNewPage } from '../pages/card-new/card-new';
import { CardNewPageModule } from '../pages/card-new/card-new.module';
import { CardListPage } from '../pages/card-list/card-list';
import { CardListPageModule } from '../pages/card-list/card-list.module';
import { CardServiceProvider } from '../providers/card/card-service';
import {CardModule} from 'ngx-card/ngx-card';
import { ExtractPage } from '../pages/extract/extract';
import { ExtractPageModule } from '../pages/extract/extract.module';

//Páginas públicas
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      platforms: {
        ios: {
          backButtonText: 'Voltar',
        }
      }
    }),
    HomePageModule,
    HttpClientModule,
    HttpModule,
    NgxQRCodeModule,
    AboutPageModule,
    ActivationPageModule,
    BillingIdentificationPageModule,
    BillingSmsPageModule,
    CardPageModule,
    KeyboardPageModule,
    ReceiptPageModule,
    LoginPageModule,
    RegisterPageModule,
    TransferPageModule,
    UserPageModule,
    CardNewPageModule,
    CardListPageModule,
    CardModule,
    ExtractPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FAQPage,
    LoginPage,
    RegisterPage,
    ActivationPage,
    //AboutPage,
    TransferPage,
    UserPage, 
    KeyboardPage,
    BillingSmsPage,
    BillingIdentificationPage,
    ReceiptPage,
    CardPage,
    CardNewPage,
    CardListPage,
    ExtractPage
  ],
  providers: [
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    AlertServiceProvider,
    QRScanner,
    CardServiceProvider
  ]
})
export class AppModule {}
