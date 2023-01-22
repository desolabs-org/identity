import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/lib/services/account';
import { IdentityService } from 'src/lib/services/identity';
import { CryptoService } from 'src/lib/services/crypto';
import { EntropyService } from 'src/lib/services/entropy';
import { GlobalVarsService } from 'src/lib/services/global-vars';
import { BackendAPIService } from 'src/lib/services/backend-api';
import { ActivatedRoute, Router } from '@angular/router';
import HDNode from 'hdkey';
import { RouteNames } from '../app-routing.module';

@Component({
  selector: 'app-log-in-seed',
  templateUrl: './log-in-seed.component.html',
})
export class LogInSeedComponent implements OnInit {
  loading = false;

  // Loading an account
  showLoadAccount = false;
  advancedOpen = true;
  loginError = '';
  mnemonic = '';
  extraText = '';
  seedHex = '';

  // Logging in
  canLogin = false;
  showAccessLevels = true;
  selectedAccount = '';

  allUsers: { [key: string]: any } = {};

  constructor(
    private accountService: AccountService,
    private identityService: IdentityService,
    private cryptoService: CryptoService,
    private entropyService: EntropyService,
    public globalVars: GlobalVarsService,
    private backendApi: BackendAPIService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  clickLoadAccount(): void {
    // Store mnemonic, seedHex and extraText locally because we clear them below and otherwise
    // they don't get saved in local storage reliably
    const mnemonic = this.mnemonic;
    const extraText = this.extraText;
    const seedHex = this.seedHex;
    const network = this.globalVars.network;

    if (mnemonic && seedHex) {
      this.loginError = 'Cannot use both mnemonic and seed hex';
      return;
    }

    let userPublicKey: string

    if (seedHex) {
      if (!/^[\da-f]{64}$/i.test(seedHex)) {
        this.loginError = 'Invalid seed hex';
        return;
      }

      userPublicKey = this.accountService.addUserWithSeedHex(
        seedHex,
        network
      );
    } else {
      if (!this.entropyService.isValidMnemonic(mnemonic)) {
        this.loginError = 'Invalid mnemonic';
        return;
      }

      const keychain = this.cryptoService.mnemonicToKeychain(mnemonic, extraText);
      const keychainNonStandard = this.cryptoService.mnemonicToKeychain(
        mnemonic,
        extraText,
        true
      );
      userPublicKey = this.accountService.addUser(
        keychain,
        mnemonic,
        extraText,
        network
      );

      // NOTE: Temporary support for 1 in 128 legacy users who have non-standard derivations
      if (keychain.publicKey !== keychainNonStandard.publicKey) {
        const seedHex = this.cryptoService.keychainToSeedHex(keychainNonStandard);
        const privateKey = this.cryptoService.seedHexToPrivateKey(seedHex);
        const publicKey = this.cryptoService.privateKeyToDeSoPublicKey(
          privateKey,
          network
        );

        // We only want to add nonStandard derivations if the account is worth importing
        this.backendApi.GetUsersStateless([publicKey]).subscribe((res) => {
          if (!res.UserList.length) {
            return;
          }
          const user = res.UserList[0];
          if (
            user.ProfileEntryResponse ||
            user.BalanceNanos > 0 ||
            user.UsersYouHODL?.length
          ) {
            // Add the non-standard key if the user has a profile, a balance, or holdings
            userPublicKey = this.accountService.addUser(
              keychainNonStandard,
              mnemonic,
              extraText,
              network
            );
          }
        });
      }
    }

    // Clear the form
    this.mnemonic = '';
    this.extraText = '';
    this.seedHex = '';

    if (this.globalVars.derive) {
      this.router.navigate(['/', RouteNames.DERIVE], {
        queryParams: { publicKey: userPublicKey },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate(['/', RouteNames.LOG_IN], {
        queryParamsHandling: 'merge',
      });
    }
  }
}
