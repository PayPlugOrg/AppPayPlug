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
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TransferPage } from '../pages/transfer/transfer';
import { UserPage } from '../pages/user/user';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { MyApp } from './app.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import _ from 'string-mask';

//Páginas públicas
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    ActivationPage,
    AboutPage,
    TransferPage,
    UserPage, 
    CardPage,
    KeyboardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    NgxQRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    ActivationPage,
    AboutPage,
    TransferPage,
    UserPage, 
    CardPage,
    KeyboardPage
  ],
  providers: [
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    AlertServiceProvider
  ]
})
export class AppModule {}
