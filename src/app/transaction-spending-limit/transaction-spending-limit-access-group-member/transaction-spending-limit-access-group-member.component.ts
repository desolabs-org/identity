import {Component, Input, OnInit} from '@angular/core';
import {GlobalVarsService} from 'src/lib/services/global-vars';
import {
  AccessGroupMemberLimitMapItem,
  AccessGroupMemberOperationString,
  AccessGroupScopeType,
  BackendAPIService,
  User
} from 'src/lib/services/backend-api';
import {TransactionSpendingLimitComponent} from '../transaction-spending-limit.component';

@Component({
  selector: 'app-transaction-spending-limit-access-group-member',
  templateUrl: './transaction-spending-limit-access-group-member.component.html',
})
export class TransactionSpendingLimitAccessGroupMemberComponent implements OnInit {
  @Input() accessGroupMemberLimitMapItem: AccessGroupMemberLimitMapItem | undefined;
  @Input() appUser: User | undefined;
  TransactionSpendingLimitComponent = TransactionSpendingLimitComponent;

  constructor(
    private backendApi: BackendAPIService,
    public globalVars: GlobalVarsService
  ) {}

  ngOnInit(): void {
  }

  isScoped(): boolean {
    return this.accessGroupMemberLimitMapItem?.ScopeType === AccessGroupScopeType.SCOPED;
  }

  getOperationString(): string {
    switch (this.accessGroupMemberLimitMapItem?.OperationType) {
      case AccessGroupMemberOperationString.ANY:
        return 'Add, remove, or update members from';
      case AccessGroupMemberOperationString.ADD:
        return 'Add members to';
      case AccessGroupMemberOperationString.REMOVE:
        return 'Remove members from';
      case AccessGroupMemberOperationString.UPDATE:
        return 'Update members from';
      default:
        return '';
    }
  }
}
