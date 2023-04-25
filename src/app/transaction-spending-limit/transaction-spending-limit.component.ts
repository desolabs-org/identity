import { Component, Input, OnInit } from '@angular/core';
import {
  AccessGroupLimitMapItem,
  AccessGroupMemberLimitMapItem,
  AssociationLimitMapItem,
  BackendAPIService,
  CoinLimitOperationString,
  CoinOperationLimitMap,
  DAOCoinLimitOrderLimitMap,
  TransactionSpendingLimitResponse,
  User,
} from 'src/lib/services/backend-api';
import { GlobalVarsService } from 'src/lib/services/global-vars';

@Component({
  selector: 'app-transaction-spending-limit',
  templateUrl: './transaction-spending-limit.component.html',
})
export class TransactionSpendingLimitComponent implements OnInit {
  @Input() transactionSpendingLimitResponse: TransactionSpendingLimitResponse =
    {
      GlobalDESOLimit: 0,
    };
  @Input() onApproveClick: () => void = () => {};
  hasUsers = false;
  userMap: { [k: string]: User } = {};
  showTransactions: boolean = false;

  static TransactionLimitsSection = 'Transaction Limits';
  static CreatorCoinLimitsSection = 'Creator Coins';
  static DAOCoinLimitsSection = 'DAOs';
  static NFTLimitsSection = 'NFTs';
  static DAOCoinLimitOrderLimitSection = 'DAO Coin Limit Orders';
  static AssociationSection = 'Associations';
  static AccessGroupSection = 'Access Groups';
  static AccessGroupMemberSection = 'Access Group Members';

  TransactionSpendingLimitComponent = TransactionSpendingLimitComponent;
  constructor(
    private backendApi: BackendAPIService,
    public globalVars: GlobalVarsService
  ) {}

  ngOnInit(): void {
    const publicKeysToFetch = [
      ...new Set<string>(
        this.getPublicKeysFromCoinOperationLimitMap(
          this.transactionSpendingLimitResponse?.CreatorCoinOperationLimitMap
        )
          .concat(
            this.getPublicKeysFromCoinOperationLimitMap(
              this.transactionSpendingLimitResponse?.DAOCoinOperationLimitMap
            )
          )
          .concat(
            this.getPublicKeysFromDAOCoinLimitOrderLimitMap(
              this.transactionSpendingLimitResponse?.DAOCoinLimitOrderLimitMap
            )
          )
          .concat(
            this.getPublicKeysFromAssociationLimitMap(
              this.transactionSpendingLimitResponse?.AssociationLimitMap,
            )
          )
          .concat(
            this.getPublicKeysFromAccessGroupLimitMap(
              this.transactionSpendingLimitResponse?.AccessGroupLimitMap,
            )
          )
          .concat(
            this.getPublicKeysFromAccessGroupLimitMap(
              this.transactionSpendingLimitResponse?.AccessGroupMemberLimitMap,
            )
          )
      ),
    ];

    this.backendApi
      .GetUsersStateless(publicKeysToFetch, true)
      .subscribe((res) => {
        res.UserList.map((user) => {
          this.userMap[user.PublicKeyBase58Check] = user;
        });
      });
  }

  getPublicKeysFromCoinOperationLimitMap(
    coinOpLimitMap: CoinOperationLimitMap<CoinLimitOperationString> | undefined
  ): string[] {
    return coinOpLimitMap ? Object.keys(coinOpLimitMap) : [];
  }

  getPublicKeysFromDAOCoinLimitOrderLimitMap(
    daoCoinLimitOrderLimitMap: DAOCoinLimitOrderLimitMap | undefined
  ): string[] {
    if (!daoCoinLimitOrderLimitMap) {
      return [];
    }
    let buyingPublicKeys = Object.keys(daoCoinLimitOrderLimitMap);
    let allKeysSet = new Set<string>(buyingPublicKeys);
    for (const buyingPublicKey of buyingPublicKeys) {
      for (const sellingPublicKey of Object.keys(
        daoCoinLimitOrderLimitMap[buyingPublicKey]
      )) {
        allKeysSet.add(sellingPublicKey);
      }
    }
    return Array.from(allKeysSet);
  }

  getPublicKeysFromAssociationLimitMap(
    associationLimitMap: AssociationLimitMapItem[] | undefined
  ): string[] {
    if (!associationLimitMap) {
      return [];
    }

    let allPublicKeys = new Set<string>();
    associationLimitMap.forEach((item) => allPublicKeys.add(item.AppPublicKeyBase58Check));
    return Array.from(allPublicKeys);
  }

  getPublicKeysFromAccessGroupLimitMap(
    accessGroupLimitMap: AccessGroupLimitMapItem[] | AccessGroupMemberLimitMapItem[] | undefined
  ): string[] {
    if (!accessGroupLimitMap) {
      return [];
    }
    let allPublicKeys = new Set<string>();
    accessGroupLimitMap.forEach((item) => allPublicKeys.add(item.AccessGroupOwnerPublicKeyBase58Check));
    return Array.from(allPublicKeys);
  }
}
