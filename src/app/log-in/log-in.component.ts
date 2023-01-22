import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { IdentityService } from '../identity.service';
import { GlobalVarsService } from '../global-vars.service';
import { BackendAPIService } from '../backend-api.service';
import { RouteNames } from '../app-routing.module';
import { Router } from '@angular/router';
import { LoginMethod, Network } from '../../types/identity';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
})
export class LogInComponent implements OnInit {
  showAccessLevels = true;

  constructor(
    public accountService: AccountService,
    private identityService: IdentityService,
    private backendApi: BackendAPIService,
    public globalVars: GlobalVarsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showAccessLevels = !this.globalVars.isFullAccessHostname();
  }

  onAccountSelect(publicKey: string): void {
    this.accountService.setAccessLevel(
      publicKey,
      this.globalVars.hostname,
      this.globalVars.accessLevelRequest
    );

    this.identityService.login({
      users: this.accountService.getEncryptedUsers(),
      publicKeyAdded: publicKey,
      signedUp: false,
    });
  }
}
