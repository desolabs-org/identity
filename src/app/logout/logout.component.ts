import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from 'src/lib/services/crypto';
import { IdentityService } from 'src/lib/services/identity';
import { AccountService } from 'src/lib/services/account';
import { AccessLevel } from '../../types/identity';
import { GlobalVarsService } from 'src/lib/services/global-vars';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
  publicKey = '';
  logoutError = '';

  @ViewChild('seedText') seedText: ElementRef | undefined;
  @ViewChild('extraText') extraText: ElementRef | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cryptoService: CryptoService,
    private identityService: IdentityService,
    private accountService: AccountService,
    public globalVars: GlobalVarsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.publicKey = params.publicKey || '';
    });
  }

  onCancel(): void {
    this.identityService.login({
      users: this.accountService.getEncryptedUsers(),
      publicKeyAdded: this.publicKey,
    });
  }

  onSubmit(): void {
    // We set the accessLevel for the logged out user to None.
    this.accountService.setAccessLevel(
      this.publicKey,
      this.globalVars.hostname,
      AccessLevel.None
    );
    // We reset the seed encryption key so that all existing accounts, except
    // the logged out user, will regenerate their encryptedSeedHex. Without this,
    // someone could have reused the encryptedSeedHex of an already logged out user.
    this.cryptoService.seedHexEncryptionKey(this.globalVars.hostname, true);
    this.finishFlow();
  }

  finishFlow(): void {
    this.identityService.login({
      users: this.accountService.getEncryptedUsers(),
    });
  }
}
