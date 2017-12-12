var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, authService, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.isLoggedIn = false;
        if (!localStorage.getItem("token")) {
            navCtrl.setRoot(LoginPage);
        }
        else {
            this.isLoggedIn = true;
        }
    }
    HomePage.prototype.logout = function () {
        var _this = this;
        this.showLoader("logout");
        this.authService.logout().then(function () {
            _this.loading.dismiss();
        });
    };
    HomePage.prototype.showLoader = function (loader) {
        var message = "";
        if (loader == "logout") {
        }
        this.loading = this.loadingCtrl.create({});
    };
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [NavController,
            AuthServiceProvider,
            LoadingController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map