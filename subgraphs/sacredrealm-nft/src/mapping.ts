import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  SpawnSn,
  Transfer
} from "../generated/SN/SN"
import { SnInfo, SnCount, SnCountByOwner } from "../generated/schema"

export function handleSpawnSn(event: SpawnSn): void {
  let snInfo = SnInfo.load(event.params.snId.toHex());
  if (!snInfo) {
    snInfo = new SnInfo(event.params.snId.toHex());
    snInfo.snId = event.params.snId;
  }

  snInfo.owner = event.params.to;
  snInfo.stars = event.params.attr[0];
  snInfo.rarity = event.params.attr[1];
  snInfo.role = event.params.attr[2];
  snInfo.part = event.params.attr[3];
  snInfo.suit = event.params.attr[4];

  snInfo.save();

  let snCount = SnCount.load(BigInt.fromI32(0).toHex());
  if (!snCount) {
    snCount = new SnCount(BigInt.fromI32(0).toHex());
  }

  snCount.total = snCount.total.plus(BigInt.fromI32(1));
  if (snInfo.stars.equals(BigInt.fromI32(4))) {
    snCount.s4 = snCount.s4.plus(BigInt.fromI32(1));
  } else if (snInfo.stars.equals(BigInt.fromI32(5))) {
    snCount.s5 = snCount.s5.plus(BigInt.fromI32(1));
  } else if (snInfo.stars.equals(BigInt.fromI32(6))) {
    snCount.s6 = snCount.s6.plus(BigInt.fromI32(1));
  } else if (snInfo.stars.equals(BigInt.fromI32(7))) {
    snCount.s7 = snCount.s7.plus(BigInt.fromI32(1));
  } else {
    snCount.s8 = snCount.s8.plus(BigInt.fromI32(1));
  }

  snCount.save();

  let snCountByOwner = SnCountByOwner.load(event.params.to.toHex());
  if (!snCountByOwner) {
    snCountByOwner = new SnCountByOwner(event.params.to.toHex());
    snCountByOwner.owner = event.params.to;
  }

  snCountByOwner.total = snCountByOwner.total.plus(BigInt.fromI32(1));
  if (snInfo.stars.equals(BigInt.fromI32(4))) {
    snCountByOwner.s4 = snCountByOwner.s4.plus(BigInt.fromI32(1));
  } else if (snInfo.stars.equals(BigInt.fromI32(5))) {
    snCountByOwner.s5 = snCountByOwner.s5.plus(BigInt.fromI32(1));
  } else if (snInfo.stars.equals(BigInt.fromI32(6))) {
    snCountByOwner.s6 = snCountByOwner.s6.plus(BigInt.fromI32(1));
  } else if (snInfo.stars.equals(BigInt.fromI32(7))) {
    snCountByOwner.s7 = snCountByOwner.s7.plus(BigInt.fromI32(1));
  } else {
    snCountByOwner.s8 = snCountByOwner.s8.plus(BigInt.fromI32(1));
  }

  snCountByOwner.save();
}

export function handleTransfer(event: Transfer): void {
  if (event.params.from.notEqual(Address.zero())) {
    let snInfo = SnInfo.load(event.params.tokenId.toHex());
    if (!snInfo) {
      snInfo = new SnInfo(event.params.tokenId.toHex());
      snInfo.snId = event.params.tokenId;
    }

    snInfo.owner = event.params.to;

    snInfo.save();

    let snCountByOwnerFrom = SnCountByOwner.load(event.params.from.toHex());
    if (!snCountByOwnerFrom) {
      snCountByOwnerFrom = new SnCountByOwner(event.params.from.toHex());
      snCountByOwnerFrom.owner = event.params.from;
    }

    snCountByOwnerFrom.total = snCountByOwnerFrom.total.minus(BigInt.fromI32(1));
    if (snInfo.stars.equals(BigInt.fromI32(4))) {
      snCountByOwnerFrom.s4 = snCountByOwnerFrom.s4.minus(BigInt.fromI32(1));
    } else if (snInfo.stars.equals(BigInt.fromI32(5))) {
      snCountByOwnerFrom.s5 = snCountByOwnerFrom.s5.minus(BigInt.fromI32(1));
    } else if (snInfo.stars.equals(BigInt.fromI32(6))) {
      snCountByOwnerFrom.s6 = snCountByOwnerFrom.s6.minus(BigInt.fromI32(1));
    } else if (snInfo.stars.equals(BigInt.fromI32(7))) {
      snCountByOwnerFrom.s7 = snCountByOwnerFrom.s7.minus(BigInt.fromI32(1));
    } else {
      snCountByOwnerFrom.s8 = snCountByOwnerFrom.s8.minus(BigInt.fromI32(1));
    }

    snCountByOwnerFrom.save();

    let snCountByOwnerTo = SnCountByOwner.load(event.params.to.toHex());
    if (!snCountByOwnerTo) {
      snCountByOwnerTo = new SnCountByOwner(event.params.to.toHex());
      snCountByOwnerTo.owner = event.params.to;
    }

    snCountByOwnerTo.total = snCountByOwnerTo.total.plus(BigInt.fromI32(1));
    if (snInfo.stars.equals(BigInt.fromI32(4))) {
      snCountByOwnerTo.s4 = snCountByOwnerTo.s4.plus(BigInt.fromI32(1));
    } else if (snInfo.stars.equals(BigInt.fromI32(5))) {
      snCountByOwnerTo.s5 = snCountByOwnerTo.s5.plus(BigInt.fromI32(1));
    } else if (snInfo.stars.equals(BigInt.fromI32(6))) {
      snCountByOwnerTo.s6 = snCountByOwnerTo.s6.plus(BigInt.fromI32(1));
    } else if (snInfo.stars.equals(BigInt.fromI32(7))) {
      snCountByOwnerTo.s7 = snCountByOwnerTo.s7.plus(BigInt.fromI32(1));
    } else {
      snCountByOwnerTo.s8 = snCountByOwnerTo.s8.plus(BigInt.fromI32(1));
    }

    snCountByOwnerTo.save();
  }
}
