import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginMethod, UserProfile } from 'src/types/identity';
import { EventEmitter } from '@angular/core';
import { AccountService } from 'src/lib/services/account';
import { BackendAPIService } from 'src/lib/services/backend-api';
import { GlobalVarsService } from 'src/lib/services/global-vars';

@Component({
  selector: 'app-account-select',
  templateUrl: './account-select.component.html'
})
export class AccountSelectComponent implements OnInit {
  // Let people either pass in the users or default to calling it the standard way
  @Output() onAccountSelect: EventEmitter<string> = new EventEmitter();
  
  @Input() allUsers: Observable<{ [key: string]: UserProfile }> =
    this.backendApi.GetUserProfiles(this.accountService.getPublicKeys());
  
  @Input() hideLoginMethod = false;
  
  hasUsers = false;
  
  constructor(
    public accountService: AccountService,
    private backendApi: BackendAPIService,
  ) {}

  ngOnInit(): void {
    const publicKeys = this.accountService.getPublicKeys();
    this.hasUsers = publicKeys.length > 0;
  }

  public getLoginIcon(loginMethod: LoginMethod) {
    return {
      [LoginMethod.DESO]: 'assets/deso-logo.png',
      [LoginMethod.METAMASK]: 'assets/metamask.png',
    }[loginMethod];
  }
}
