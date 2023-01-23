import { Component, OnInit } from '@angular/core';
import { GlobalVarsService } from 'src/lib/services/global-vars';
import { IdentityService } from 'src/lib/services/identity';
import { AccessLevel, Network } from 'src/types/identity';
import { AccountService } from 'src/lib/services/account';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'identity';

  isLoading = true;

  constructor(
    private accountService: AccountService,
    private globalVars: GlobalVarsService,
    private identityService: IdentityService
  ) {}

  ngOnInit(): void {
    // load params
    const params = new URLSearchParams(window.location.search);

    // grab hash parameters from window and not activatedRoute because init is run before detecting fragment
    let hashParams;
    if (window.location.hash && window.location.hash.length > 1) {
      // hash includes the hashtag symbol so use substring to remove it
      hashParams = new URLSearchParams(window.location.hash.substring(1));
    }

    const accessLevelRequest = params.get('accessLevelRequest');
    if (accessLevelRequest) {
      this.globalVars.accessLevelRequest = parseInt(accessLevelRequest, 10);
    }

    this.globalVars.signedUp = (params.get('signedUp') === 'true');
    this.globalVars.webview = (params.get('webview') === 'true');

    if (params.get('testnet') === 'true') {
      this.globalVars.network = Network.testnet;
    }

    // Callback should only be used in mobile applications, where payload is passed through URL parameters.
    const callback = params.get('callback');
    if (callback) {
      try {
        const callbackURL = new URL(callback as string);
        this.globalVars.callback = callbackURL.href;
      } catch (err) {
        this.globalVars.callbackInvalid = true;
        console.error(err);
      }
    }

    if (
      params.get('derive') === 'true'
    ) {
      this.globalVars.derive = true;
    }

    const transactionSpendingLimitResponse = params.get('transactionSpendingLimitResponse');
    if (transactionSpendingLimitResponse) {
      this.globalVars.transactionSpendingLimitResponse = transactionSpendingLimitResponse;
    }

    const derivedPublicKey = params.get('derivedPublicKey');
    if (derivedPublicKey) {
      this.globalVars.derivedPublicKey = derivedPublicKey;
    }

    this.globalVars.deleteKey = params.get('deleteKey') === 'true';

    const expirationDays = parseInt(params.get('expirationDays') || '0', 10);
    if (expirationDays) {
      this.globalVars.expirationDays = expirationDays;
    }

    if (this.globalVars.callback) {
      // If callback is set, we won't be sending the initialize message.
      this.globalVars.hostname = 'localhost';
      this.finishInit();
    } else if (
      this.globalVars.webview ||
      this.globalVars.inTab ||
      this.globalVars.inFrame()
    ) {
      // We must be running in a webview OR opened with window.open OR in an iframe to initialize
      this.identityService.initialize().subscribe((res) => {
        this.globalVars.hostname = res.hostname;
        if (this.globalVars.isFullAccessHostname()) {
          this.globalVars.accessLevelRequest = AccessLevel.Full;
        }

        this.finishInit();
      });
    } else {
      // Identity currently doesn't have any management UIs that can be accessed directly
      window.location.href = `https://desolabs.org`;
    }
  }

  finishInit(): void {
    this.isLoading = false;
  }
}
