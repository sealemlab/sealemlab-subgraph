import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  BuyBoxes,
  Transfer
} from "../generated/SB/SB"
import { SbInfo, SbCount, SbCountByOwner } from "../generated/schema"

export function handleBuyBoxes(event: BuyBoxes): void {
  for (let i = 0; i < event.params.sbIds.length; i++) {
    let sbInfo = SbInfo.load(event.params.sbIds[i].toHex());
    if (!sbInfo) {
      sbInfo = new SbInfo(event.params.sbIds[i].toHex());
      sbInfo.sbId = event.params.sbIds[i];
    }

    sbInfo.owner = event.params.user;
    sbInfo.boxType = event.params.boxType;

    sbInfo.save();

    let sbCount = SbCount.load(BigInt.fromI32(0).toHex());
    if (!sbCount) {
      sbCount = new SbCount(BigInt.fromI32(0).toHex());
    }

    sbCount.total = sbCount.total.plus(BigInt.fromI32(1));
    if (sbInfo.boxType.equals(BigInt.fromI32(0))) {
      sbCount.t0 = sbCount.t0.plus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(1))) {
      sbCount.t1 = sbCount.t1.plus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(2))) {
      sbCount.t2 = sbCount.t2.plus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(3))) {
      sbCount.t3 = sbCount.t3.plus(BigInt.fromI32(1));
    } else {
      sbCount.t4 = sbCount.t4.plus(BigInt.fromI32(1));
    }

    let sbCountByOwner = SbCountByOwner.load(event.params.user.toHex());
    if (!sbCountByOwner) {
      sbCountByOwner = new SbCountByOwner(event.params.user.toHex());
      sbCountByOwner.owner = event.params.user;
    }

    sbCountByOwner.total = sbCountByOwner.total.plus(BigInt.fromI32(1));
    if (sbCountByOwner.total.equals(BigInt.fromI32(1))) sbCount.owners.plus(BigInt.fromI32(1));
    if (sbInfo.boxType.equals(BigInt.fromI32(0))) {
      sbCountByOwner.t0 = sbCountByOwner.t0.plus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(1))) {
      sbCountByOwner.t1 = sbCountByOwner.t1.plus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(2))) {
      sbCountByOwner.t2 = sbCountByOwner.t2.plus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(3))) {
      sbCountByOwner.t3 = sbCountByOwner.t3.plus(BigInt.fromI32(1));
    } else {
      sbCountByOwner.t4 = sbCountByOwner.t4.plus(BigInt.fromI32(1));
    }

    sbCountByOwner.save();

    sbCount.save();
  }
}

export function handleTransfer(event: Transfer): void {
  if (event.params.from.notEqual(Address.zero())) {
    let sbInfo = SbInfo.load(event.params.tokenId.toHex());
    if (!sbInfo) {
      sbInfo = new SbInfo(event.params.tokenId.toHex());
      sbInfo.sbId = event.params.tokenId;
    }

    sbInfo.owner = event.params.to;

    sbInfo.save();

    let sbCount = SbCount.load(BigInt.fromI32(0).toHex());
    if (!sbCount) {
      sbCount = new SbCount(BigInt.fromI32(0).toHex());
    }

    let sbCountByOwnerFrom = SbCountByOwner.load(event.params.from.toHex());
    if (!sbCountByOwnerFrom) {
      sbCountByOwnerFrom = new SbCountByOwner(event.params.from.toHex());
      sbCountByOwnerFrom.owner = event.params.from;
    }

    sbCountByOwnerFrom.total = sbCountByOwnerFrom.total.minus(BigInt.fromI32(1));
    if (sbCountByOwnerFrom.total.equals(BigInt.fromI32(0))) sbCount.owners.minus(BigInt.fromI32(1));
    if (sbInfo.boxType.equals(BigInt.fromI32(0))) {
      sbCountByOwnerFrom.t0 = sbCountByOwnerFrom.t0.minus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(1))) {
      sbCountByOwnerFrom.t1 = sbCountByOwnerFrom.t1.minus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(2))) {
      sbCountByOwnerFrom.t2 = sbCountByOwnerFrom.t2.minus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(3))) {
      sbCountByOwnerFrom.t3 = sbCountByOwnerFrom.t3.minus(BigInt.fromI32(1));
    } else {
      sbCountByOwnerFrom.t4 = sbCountByOwnerFrom.t4.minus(BigInt.fromI32(1));
    }

    sbCountByOwnerFrom.save();

    let sbCountByOwnerTo = SbCountByOwner.load(event.params.to.toHex());
    if (!sbCountByOwnerTo) {
      sbCountByOwnerTo = new SbCountByOwner(event.params.to.toHex());
      sbCountByOwnerTo.owner = event.params.to;
    }

    sbCountByOwnerTo.total = sbCountByOwnerTo.total.plus(BigInt.fromI32(1));
    if (sbCountByOwnerTo.total.equals(BigInt.fromI32(1))) sbCount.owners.plus(BigInt.fromI32(1));
    if (sbInfo.boxType.equals(BigInt.fromI32(0))) {
      sbCountByOwnerTo.t0 = sbCountByOwnerTo.t0.plus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(1))) {
      sbCountByOwnerTo.t1 = sbCountByOwnerTo.t1.plus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(2))) {
      sbCountByOwnerTo.t2 = sbCountByOwnerTo.t2.plus(BigInt.fromI32(1));
    } else if (sbInfo.boxType.equals(BigInt.fromI32(3))) {
      sbCountByOwnerTo.t3 = sbCountByOwnerTo.t3.plus(BigInt.fromI32(1));
    } else {
      sbCountByOwnerTo.t4 = sbCountByOwnerTo.t4.plus(BigInt.fromI32(1));
    }

    sbCountByOwnerTo.save();

    sbCount.save();
  }
}
