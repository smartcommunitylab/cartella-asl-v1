import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'cm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  loginSelected:boolean=false;
  username:string='';
  password:string='';
  type: string = '';
  errMsg: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['errMsg']) {
        this.errMsg = params['errMsg'];
      }
    });
  }

  login(type){
    this.loginSelected = true;
    this.type=type; 
    this.entra();
  } 
  entra() {
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    window.location.href = baseUrl+'/asl-'+this.type+'/#/home';
    

  }
}
