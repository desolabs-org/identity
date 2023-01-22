import { Component, OnInit } from '@angular/core';
import { GlobalVarsService } from '../global-vars.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
})
export class BannerComponent implements OnInit {
  constructor(public globalVars: GlobalVarsService) {}

  ngOnInit(): void {}
}
