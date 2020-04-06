import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

// import { AuthService } from '../services/auth.service';
import { GrowlerService, GrowlerMessageType } from '../growler/growler.service';
import { DataService } from '../services/data.service';
import { Studente } from '../../shared/interfaces';
import { PermissionService } from '../services/permission.service';

@Component({
    selector: 'cm-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    isCollapsed: boolean = true;
    loginLogoutText: string = 'Login';
    sub: Subscription;
    studenti = [];
    actualUser;
    isSticky: boolean = false;
    istitutoName = "";
    profile;
    profileDropdownVisible;
    @ViewChild('navbar') private navbarToStick;
    @ViewChild('navbarHeaderTop') private navbarHeaderTop;

    @Output() isStickyListener = new EventEmitter<boolean>();

    constructor(private router: Router, private growler: GrowlerService, private dataService: DataService, public permissionService: PermissionService) { }

    ngOnInit() {
        this.dataService.getProfile().subscribe(profile => {
            //set profile ID
            console.log(profile)
            if (profile) {
                this.profile = profile;
                sessionStorage.setItem('access_token', profile.token)
            }
        }, err => {
            //todo
            console.log('error, no institute')
        });

    }

    getIstitutoName(id) {
        this.dataService.getIstitutoById(id).subscribe(istituto => {
            this.istitutoName = istituto.name;
        })
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    loginOrOut() {

    }
    logout() {
        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
        var logoutUrl = baseUrl + '/logout?target='+baseUrl+'/asl-login/';
        window.location.href = logoutUrl;

    }
    redirectToLogin() {
        this.router.navigate(['/login']);
    }

    setLoginLogoutText() {
    }

    @HostListener("window:scroll", [])
    onWindowScroll() {
        var sticky = this.navbarHeaderTop.nativeElement.clientHeight;
        if (this.isSticky != (window.pageYOffset >= sticky)) {
            this.isSticky = window.pageYOffset >= sticky;
            this.isStickyListener.emit(this.isSticky);
        }
    }

}