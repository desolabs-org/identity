import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { GlobalVarsService } from 'src/lib/services/global-vars';
import {
  BackendAPIService,
  NFTLimitOperationString,
  OperationToCountMap,
  PostEntryResponse,
} from 'src/lib/services/backend-api';
import { TransactionSpendingLimitComponent } from '../transaction-spending-limit.component';

@Component({
  selector: 'app-transaction-spending-limit-nft',
  templateUrl: './transaction-spending-limit-nft.component.html',
})
export class TransactionSpendingLimitNftComponent implements OnInit {
  @Input() nftPostHashHex: string = '';
  @Input() nftSerialNumToOperationMap:
    | { [k: number]: OperationToCountMap<NFTLimitOperationString> }
    | undefined;

  showAll: boolean = false;
  expandNFT: boolean = false;
  defaultNumShown: number = 5;
  loaded: boolean = false;
  TransactionSpendingLimitComponent = TransactionSpendingLimitComponent;

  post: PostEntryResponse | undefined;

  constructor(
    private backendApi: BackendAPIService,
    public globalVars: GlobalVarsService
  ) {}

  ngOnInit(): void {
    (this.nftPostHashHex
      ? this.backendApi.GetSinglePost(this.nftPostHashHex)
      : of(undefined)
    )
      .subscribe((res) => {
        this.post = res;
      })
      .add(() => (this.loaded = true));
  }

  getOperationsString(
    operationsMap:
      | { [k: number]: OperationToCountMap<NFTLimitOperationString> }
      | undefined
  ): string {
    if (!operationsMap) {
      return '';
    }
    let opSet = new Set<string>();
    Object.values(operationsMap).map((opToCountMap) =>
      Object.keys(opToCountMap).map((op) => opSet.add(op))
    );
    return Array.from(opSet)
      .sort()
      .map((op) => this.globalVars.cleanSpendingLimitOperationName(op))
      .join(', ');
  }
}
