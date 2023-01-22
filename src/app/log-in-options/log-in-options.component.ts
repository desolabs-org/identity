import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from '../app-routing.module';
import { Network } from 'src/types/identity';

@Component({
  selector: 'app-log-in-options',
  templateUrl: './log-in-options.component.html',
})
export class LogInOptionsComponent implements OnInit {
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {}

  navigateToMetamaskSignup(): void {
    this.router.navigate(['/', RouteNames.SIGN_UP_METAMASK], {
      queryParamsHandling: 'merge',
    });
  }

  navigateToGetDeso(publicKey: string): void {
    this.router.navigate(['/'], {
      queryParamsHandling: 'merge',
      queryParams: { publicKey },
    });
  }
}
