import { Component, Input, OnInit } from '@angular/core';
import {
  AccessGroupLimitMapItem,
  AccessGroupMemberLimitMapItem,
  AssociationLimitMapItem,
  CreatorCoinLimitOperationString,
  CreatorCoinOperationLimitMap,
  DAOCoinLimitOperationString,
  DAOCoinLimitOrderLimitItem,
  DAOCoinLimitOrderLimitMap,
  DAOCoinOperationLimitMap,
  NFTLimitOperationString,
  NFTOperationLimitMap,
  OperationToCountMap,
  User,
} from 'src/lib/services/backend-api';
import { GlobalVarsService } from 'src/lib/services/global-vars';
import { TransactionSpendingLimitComponent } from '../transaction-spending-limit.component';

@Component({
  selector: 'app-transaction-spending-limit-section',
  templateUrl: './transaction-spending-limit-section.component.html',
})
export class TransactionSpendingLimitSectionComponent implements OnInit {
  @Input() sectionMap:
    | { [k: string]: number }
    | CreatorCoinOperationLimitMap
    | DAOCoinOperationLimitMap
    | NFTOperationLimitMap
    | DAOCoinLimitOrderLimitMap
    | AssociationLimitMapItem[]
    | AccessGroupLimitMapItem[]
    | AccessGroupMemberLimitMapItem[] = {};
  @Input() sectionTitle: string = '';

  @Input() userMap: { [k: string]: User } = {};
  showDetails: boolean = false;
  showAll: boolean = false;
  defaultNumShown: number = 5;
  TransactionSpendingLimitComponent = TransactionSpendingLimitComponent;
  anyCreatorItem:
    | OperationToCountMap<CreatorCoinLimitOperationString>
    | OperationToCountMap<DAOCoinLimitOperationString>
    | undefined;
  anyNFTItem: OperationToCountMap<NFTLimitOperationString> | undefined;

  coinLimitMap: CreatorCoinOperationLimitMap | DAOCoinOperationLimitMap = {};
  txnLimitMap: { [k: string]: number } = {};
  nftLimitMap: NFTOperationLimitMap = {};
  daoCoinLimitOrderLimitMap: DAOCoinLimitOrderLimitMap = {};
  daoCoinLimitOrderLimitItems: DAOCoinLimitOrderLimitItem[] = [];
  associationLimitMap: AssociationLimitMapItem[] = [];
  accessGroupLimitMap: AccessGroupLimitMapItem[] = [];
  accessGroupMemberLimitMap: AccessGroupMemberLimitMapItem[] = [];

  constructor(public globalVars: GlobalVarsService) {}

  ngOnInit(): void {
    switch (this.sectionTitle) {
      case TransactionSpendingLimitComponent.TransactionLimitsSection:
        this.txnLimitMap = this.sectionMap as { [k: string]: number };
        break;
      case TransactionSpendingLimitComponent.CreatorCoinLimitsSection:
      case TransactionSpendingLimitComponent.DAOCoinLimitsSection:
        this.anyCreatorItem = (this.sectionMap as DAOCoinOperationLimitMap | CreatorCoinOperationLimitMap)[''] as
          | OperationToCountMap<CreatorCoinLimitOperationString>
          | OperationToCountMap<DAOCoinLimitOperationString>
          | undefined;
        this.coinLimitMap = {...this.sectionMap} as
          | CreatorCoinOperationLimitMap
          | DAOCoinOperationLimitMap;
        delete this.coinLimitMap[''];
        break;
      case TransactionSpendingLimitComponent.NFTLimitsSection:
        this.anyNFTItem = (this.sectionMap as NFTOperationLimitMap)[''] as
          | OperationToCountMap<NFTLimitOperationString>
          | undefined;
        this.nftLimitMap = {...this.sectionMap} as NFTOperationLimitMap;
        delete this.nftLimitMap[''];
        break;
      case TransactionSpendingLimitComponent.DAOCoinLimitOrderLimitSection:
        this.daoCoinLimitOrderLimitMap = this
          .sectionMap as DAOCoinLimitOrderLimitMap;
        for (const buyingPublicKey of Object.keys(
          this.daoCoinLimitOrderLimitMap
        )) {
          const sellingPublicKeys = Object.keys(
            this.daoCoinLimitOrderLimitMap[buyingPublicKey]
          );
          sellingPublicKeys.map((sellingPublicKey) => {
            this.daoCoinLimitOrderLimitItems.push({
              BuyingPublicKey: buyingPublicKey,
              SellingPublicKey: sellingPublicKey,
              OpCount:
                this.daoCoinLimitOrderLimitMap[buyingPublicKey][
                  sellingPublicKey
                ],
            });
          });
        }
        break;
      case TransactionSpendingLimitComponent.AssociationSection:
        this.associationLimitMap = this.sectionMap as AssociationLimitMapItem[];
        break;
      case TransactionSpendingLimitComponent.AccessGroupSection:
        this.accessGroupLimitMap = this.sectionMap as AccessGroupLimitMapItem[];
        break;
      case TransactionSpendingLimitComponent.AccessGroupMemberSection:
        this.accessGroupMemberLimitMap = this.sectionMap as AccessGroupMemberLimitMapItem[];
    }

    this.showAll = this.getSectionMapLength() <= this.defaultNumShown;
  }

  sectionItemType(): string {
    switch (this.sectionTitle) {
      case TransactionSpendingLimitComponent.TransactionLimitsSection:
        return 'transaction type';
      case TransactionSpendingLimitComponent.CreatorCoinLimitsSection:
        return 'creator coin';
      case TransactionSpendingLimitComponent.DAOCoinLimitsSection:
        return 'DAO coin';
      case TransactionSpendingLimitComponent.NFTLimitsSection:
        return 'NFT';
      case TransactionSpendingLimitComponent.DAOCoinLimitOrderLimitSection:
        return 'DAO coin limit order';
      case TransactionSpendingLimitComponent.AssociationSection:
        return 'Association';
      case TransactionSpendingLimitComponent.AccessGroupSection:
        return 'Access Group';
      case TransactionSpendingLimitComponent.AccessGroupMemberSection:
        return 'Access Group Member';
      default:
        return '';
    }
  }

  hasAnyCreatorOrNFT(): boolean {
    switch (this.sectionTitle) {
      case TransactionSpendingLimitComponent.CreatorCoinLimitsSection:
      case TransactionSpendingLimitComponent.DAOCoinLimitsSection:
        return !!this.anyCreatorItem;
      case TransactionSpendingLimitComponent.NFTLimitsSection:
        return !!this.anyNFTItem;
    }
    return false;
  }

  sectionSummary(): string {
    const operationsStr =
      this.sectionTitle !==
        TransactionSpendingLimitComponent.TransactionLimitsSection &&
      this.sectionTitle !==
        TransactionSpendingLimitComponent.DAOCoinLimitOrderLimitSection
        ? 'operations on '
        : '';
    const keyLen = this.getSectionMapLength();
    const sectionItemType = this.sectionItemType();
    return `This app can execute the following ${operationsStr}${keyLen} specific ${sectionItemType}${
      keyLen > 1 ? 's' : ''
    } ${
      this.hasAnyCreatorOrNFT()
        ? ` as well as operations on all ${sectionItemType}s`
        : ''
    }`;
  }

  getSectionMapLength(): number {
    switch (this.sectionTitle) {
      case TransactionSpendingLimitComponent.DAOCoinLimitOrderLimitSection:
        return this.daoCoinLimitOrderLimitItems.length;
      case TransactionSpendingLimitComponent.AssociationSection:
        return this.associationLimitMap.length;
      case TransactionSpendingLimitComponent.AccessGroupSection:
        return this.accessGroupLimitMap.length;
      case TransactionSpendingLimitComponent.AccessGroupMemberSection:
        return this.accessGroupMemberLimitMap.length;
      default:
        return this.globalVars.ObjectKeyLength(this.sectionMap);
    }
  }
}
