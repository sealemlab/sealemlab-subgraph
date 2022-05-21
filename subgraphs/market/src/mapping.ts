import { store, BigInt, Address } from '@graphprotocol/graph-ts'
import { Market, Buy, Cancel, Sell } from '../generated/Market/Market'
import { SN } from '../../sacredrealm-nft/generated/SN/SN'
import { SB } from '../../sacredrealm-box/generated/SB/SB'
import { BuyInfo, BuyCount, SellInfo, SellCount } from '../generated/schema'

const snAddr = Address.fromString('0xEEa8bD31DA9A2169C38968958B6DF216381B0f08');
const sbAddr = Address.fromString('0xEEa8bD31DA9A2169C38968958B6DF216381B0f08');

export function handleBuy(event: Buy): void {
  for (let i = 0; i < event.params.nftIds.length; i++) {
    let buyInfo = BuyInfo.load(event.transaction.hash.toHex() + '-' + event.logIndex.toString() + '-' + event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
    if (!buyInfo) {
      buyInfo = new BuyInfo(event.transaction.hash.toHex() + '-' + event.logIndex.toString() + '-' + event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
      buyInfo.nft = event.params.nfts[i];
      buyInfo.nftId = event.params.nftIds[i];
    }
    const market = Market.bind(event.address);
    const sn = SN.bind(snAddr);
    const sb = SB.bind(sbAddr);

    buyInfo.buyer = event.params.buyer;
    buyInfo.seller = event.params.sellers[i];
    buyInfo.token = event.params.tokens[i];
    buyInfo.price = event.params.prices[i];
    buyInfo.fee = market.fee();
    buyInfo.feeAmount = buyInfo.price.times(buyInfo.fee).div(BigInt.fromI32(10000));
    buyInfo.sellAmount = buyInfo.price.minus(buyInfo.feeAmount);
    buyInfo.buyTime = event.block.timestamp;

    if (buyInfo.nft == snAddr) {
      const attr = sn.getDatas(buyInfo.nftId, 'attr');
      buyInfo.stars = attr[0];
      buyInfo.rarity = attr[1];
      buyInfo.role = attr[2];
      buyInfo.part = attr[3];
      buyInfo.suit = attr[4];
    }

    if (buyInfo.nft == sbAddr) {
      buyInfo.boxType = sb.sbIdToType(buyInfo.nftId);
    }

    buyInfo.save();

    let buyCount = BuyCount.load(buyInfo.nft.toHex() + '-' + buyInfo.token.toHex());
    if (!buyCount) {
      buyCount = new BuyCount(buyInfo.nft.toHex() + '-' + buyInfo.token.toHex());
      buyCount.nft = buyInfo.nft;
      buyCount.token = buyInfo.token;
    }

    buyCount.transactions = buyCount.transactions.plus(BigInt.fromI32(1));
    buyCount.volume = buyCount.volume.plus(buyInfo.price);

    buyCount.save();

    let sellCount = SellCount.load(buyInfo.nft.toHex() + '-' + buyInfo.token.toHex());
    if (!sellCount) {
      sellCount = new SellCount(buyInfo.nft.toHex() + '-' + buyInfo.token.toHex());
      sellCount.nft = buyInfo.nft;
      sellCount.token = buyInfo.token;
    }

    sellCount.items = sellCount.items.minus(BigInt.fromI32(1));

    sellCount.save();

    store.remove('SellInfo', event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
  }
}

export function handleCancel(event: Cancel): void {
  for (let i = 0; i < event.params.nftIds.length; i++) {
    let sellInfo = SellInfo.load(event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
    if (!sellInfo) {
      sellInfo = new SellInfo(event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
      sellInfo.nft = event.params.nfts[i];
      sellInfo.nftId = event.params.nftIds[i];
    }

    let sellCount = SellCount.load(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
    if (!sellCount) {
      sellCount = new SellCount(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
      sellCount.nft = sellInfo.nft;
      sellCount.token = sellInfo.token;
    }

    sellCount.items = sellCount.items.minus(BigInt.fromI32(1));

    sellCount.save();

    store.remove('SellInfo', event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
  }
}

export function handleSell(event: Sell): void {
  for (let i = 0; i < event.params.nftIds.length; i++) {
    let sellInfo = SellInfo.load(event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
    if (!sellInfo) {
      sellInfo = new SellInfo(event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
      sellInfo.nft = event.params.nfts[i];
      sellInfo.nftId = event.params.nftIds[i];
    }
    const sn = SN.bind(snAddr);
    const sb = SB.bind(sbAddr);

    sellInfo.seller = event.params.seller;
    sellInfo.token = event.params.tokens[i];
    sellInfo.price = event.params.prices[i];
    sellInfo.sellTime = event.block.timestamp;

    if (sellInfo.nft == snAddr) {
      const attr = sn.getDatas(sellInfo.nftId, 'attr');
      sellInfo.stars = attr[0];
      sellInfo.rarity = attr[1];
      sellInfo.role = attr[2];
      sellInfo.part = attr[3];
      sellInfo.suit = attr[4];
    }

    if (sellInfo.nft == sbAddr) {
      sellInfo.boxType = sb.sbIdToType(sellInfo.nftId);
    }

    sellInfo.save();

    let sellCount = SellCount.load(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
    if (!sellCount) {
      sellCount = new SellCount(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
      sellCount.nft = sellInfo.nft;
      sellCount.token = sellInfo.token;
    }

    sellCount.items = sellCount.items.plus(BigInt.fromI32(1));

    sellCount.save();
  }
}