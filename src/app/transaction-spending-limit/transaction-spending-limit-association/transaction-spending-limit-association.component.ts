import {Component, Input, OnInit} from '@angular/core';
import {GlobalVarsService} from 'src/lib/services/global-vars';
import {
  AssociationAppScopeType,
  AssociationLimitMapItem,
  AssociationOperationString,
  BackendAPIService,
  User
} from 'src/lib/services/backend-api';
import {TransactionSpendingLimitComponent} from '../transaction-spending-limit.component';

@Component({
  selector: 'app-transaction-spending-limit-association',
  templateUrl: './transaction-spending-limit-association.component.html',
})
export class TransactionSpendingLimitAssociationComponent implements OnInit {
  @Input() associationLimitMapItem: AssociationLimitMapItem | undefined;
  @Input() appUser: User | undefined;
  TransactionSpendingLimitComponent = TransactionSpendingLimitComponent;

  constructor(
    private backendApi: BackendAPIService,
    public globalVars: GlobalVarsService
  ) {}

  ngOnInit(): void {
  }

  getOperationString(): string {
    switch (this.associationLimitMapItem?.AssociationOperation) {
      case AssociationOperationString.ANY:
        return 'Create or delete';
      case AssociationOperationString.CREATE:
        return 'Create';
      case AssociationOperationString.DELETE:
        return 'Delete';
      default:
        return '';
    }
  }
}
