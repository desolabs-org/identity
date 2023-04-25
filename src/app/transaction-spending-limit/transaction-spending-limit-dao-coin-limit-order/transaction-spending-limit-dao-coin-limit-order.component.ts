import { Component, Input, OnInit } from '@angular/core';
import { DAOCoinLimitOrderLimitItem, User } from 'src/lib/services/backend-api';
import { GlobalVarsService } from 'src/lib/services/global-vars';
import { TransactionSpendingLimitComponent } from '../transaction-spending-limit.component';

@Component({
  selector: 'app-transaction-spending-limit-dao-coin-limit-order',
  templateUrl:
    './transaction-spending-limit-dao-coin-limit-order.component.html',
})
export class TransactionSpendingLimitDaoCoinLimitOrderComponent
  implements OnInit
{
  @Input() daoCoinLimitOrderLimitItem: DAOCoinLimitOrderLimitItem | undefined;
  @Input() buyingUser: User | undefined;
  @Input() sellingUser: User | undefined;
  TransactionSpendingLimitComponent = TransactionSpendingLimitComponent;

  constructor(public globalVars: GlobalVarsService) {}

  ngOnInit(): void {}
}
