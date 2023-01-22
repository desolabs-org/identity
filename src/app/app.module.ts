import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmbedComponent } from './embed/embed.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdentityService } from './identity.service';
import { CookieModule } from 'ngx-cookie';
import { LogoutComponent } from './logout/logout.component';
import { BannerComponent } from './banner/banner.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AccountService } from './account.service';
import { EntropyService } from './entropy.service';
import { LogInComponent } from './log-in/log-in.component';
import { HttpClientModule } from '@angular/common/http';
import { ApproveComponent } from './approve/approve.component';
import { LogInSeedComponent } from './log-in-seed/log-in-seed.component';
import { GoogleComponent } from './auth/google/google.component';
import { AvatarDirective } from './avatar/avatar.directive';
import { DeriveComponent } from './derive/derive.component';
import { ErrorCallbackComponent } from './error-callback/error-callback.component';
import { SharedSecretComponent } from './shared-secret/shared-secret.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { TransactionSpendingLimitComponent } from './transaction-spending-limit/transaction-spending-limit.component';
import { TransactionSpendingLimitSectionComponent } from './transaction-spending-limit/transaction-spending-limit-section/transaction-spending-limit-section.component';
import { TransactionSpendingLimitCoinComponent } from './transaction-spending-limit/transaction-spending-limit-coin/transaction-spending-limit-coin.component';
import { TransactionSpendingLimitNftComponent } from './transaction-spending-limit/transaction-spending-limit-nft/transaction-spending-limit-nft.component';
import { SanitizePostBodyPipe } from 'src/lib/pipes/sanitize-and-auto-link-pipe';
import { SanitizeVideoUrlPipe } from 'src/lib/pipes/sanitize-video-url-pipe';
import { TransactionSpendingLimitDaoCoinLimitOrderComponent } from './transaction-spending-limit/transaction-spending-limit-dao-coin-limit-order/transaction-spending-limit-dao-coin-limit-order.component';
import { MessagingGroupComponent } from './messaging-group/messaging-group.component';
import { SignUpMetamaskComponent } from './sign-up-metamask/sign-up-metamask.component';
import { MetamaskService } from './metamask.service';
import { ArrowToggleComponent } from './arrow-toggle/arrow-toggle.component';
import { TruncateAddressOrUsernamePipe } from 'src/lib/pipes/truncate-deso-address.pipe';
import { LogInOptionsComponent } from './log-in-options/log-in-options.component';
import { AccountSelectComponent } from './account-select/account-select.component';

@NgModule({
  declarations: [
    AppComponent,
    EmbedComponent,
    HomeComponent,
    LogoutComponent,
    BannerComponent,
    SignUpComponent,
    LogInComponent,
    ApproveComponent,
    LogInSeedComponent,
    GoogleComponent,
    AvatarDirective,
    DeriveComponent,
    ErrorCallbackComponent,
    SharedSecretComponent,
    TransactionSpendingLimitComponent,
    TransactionSpendingLimitSectionComponent,
    TransactionSpendingLimitCoinComponent,
    TransactionSpendingLimitNftComponent,
    SanitizePostBodyPipe,
    SanitizeVideoUrlPipe,
    TransactionSpendingLimitDaoCoinLimitOrderComponent,
    SignUpMetamaskComponent,
    ArrowToggleComponent,
    TruncateAddressOrUsernamePipe,
    LogInOptionsComponent,
    AccountSelectComponent,
    MessagingGroupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    CookieModule.forRoot(),
  ],
  providers: [
    IdentityService,
    EntropyService,
    AccountService,
    MetamaskService,
    TruncateAddressOrUsernamePipe,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
