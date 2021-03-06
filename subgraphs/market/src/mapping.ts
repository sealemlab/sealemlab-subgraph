import { store, BigInt, Address } from '@graphprotocol/graph-ts'
import { Market, Buy, Cancel, Sell } from '../generated/Market/Market'
import { SB } from '../../sacredrealm-box/generated/SB/SB'
import { SN } from '../../sacredrealm-nft/generated/SN/SN'
import { BuyInfo, SellInfo, Counter } from '../generated/schema'

const sbAddr = Address.fromString('0xA8De106949D494E2b346E4496695Abe71C4b02eC');
const snAddr = Address.fromString('0xcE4c314f5baeDea571c60CF1D09eCf4304FeCF6A');

export function handleBuy(event: Buy): void {
  for (let i = 0; i < event.params.nftIds.length; i++) {
    let buyInfo = BuyInfo.load(event.transaction.hash.toHex() + '-' + event.logIndex.toString() + '-' + event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
    if (!buyInfo) {
      buyInfo = new BuyInfo(event.transaction.hash.toHex() + '-' + event.logIndex.toString() + '-' + event.params.nfts[i].toHex() + '-' + event.params.nftIds[i].toHex());
      buyInfo.nft = event.params.nfts[i];
      buyInfo.nftId = event.params.nftIds[i];
    }
    const market = Market.bind(event.address);
    const sb = SB.bind(sbAddr);
    const sn = SN.bind(snAddr);

    buyInfo.buyer = event.params.buyer;
    buyInfo.seller = event.params.sellers[i];
    buyInfo.token = event.params.tokens[i];
    buyInfo.price = event.params.prices[i];
    buyInfo.fee = market.fee();
    buyInfo.feeAmount = buyInfo.price.times(buyInfo.fee).div(BigInt.fromI32(10000));
    buyInfo.sellAmount = buyInfo.price.minus(buyInfo.feeAmount);
    buyInfo.buyTime = event.block.timestamp;

    if (buyInfo.nft == sbAddr) {
      buyInfo.boxType = sb.sbIdToType(buyInfo.nftId);
    }

    if (buyInfo.nft == snAddr) {
      const attr = sn.getDatas(buyInfo.nftId, 'attr');
      buyInfo.stars = attr[0];
      buyInfo.rarity = attr[1].plus(BigInt.fromI32(19)).div(BigInt.fromI32(20));
      buyInfo.power = attr[1]
      buyInfo.role = attr[2];
      buyInfo.part = attr[3];
      buyInfo.suit = attr[4];
    }

    buyInfo.save();

    let counter = Counter.load(buyInfo.nft.toHex() + '-' + buyInfo.token.toHex());
    if (!counter) {
      counter = new Counter(buyInfo.nft.toHex() + '-' + buyInfo.token.toHex());
      counter.nft = buyInfo.nft;
      counter.token = buyInfo.token;
    }

    counter.transactions = counter.transactions.plus(BigInt.fromI32(1));
    counter.volume = counter.volume.plus(buyInfo.price);
    counter.items = counter.items.minus(BigInt.fromI32(1));

    counter.save();

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

    let counter = Counter.load(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
    if (!counter) {
      counter = new Counter(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
      counter.nft = sellInfo.nft;
      counter.token = sellInfo.token;
    }

    counter.items = counter.items.minus(BigInt.fromI32(1));

    counter.save();

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
    const sb = SB.bind(sbAddr);
    const sn = SN.bind(snAddr);

    sellInfo.seller = event.params.seller;
    sellInfo.token = event.params.tokens[i];
    sellInfo.price = event.params.prices[i];
    sellInfo.sellTime = event.block.timestamp;

    if (sellInfo.nft == sbAddr) {
      sellInfo.boxType = sb.sbIdToType(sellInfo.nftId);
    }

    if (sellInfo.nft == snAddr) {
      const attr = sn.getDatas(sellInfo.nftId, 'attr');
      sellInfo.stars = attr[0];
      sellInfo.rarity = attr[1].plus(BigInt.fromI32(19)).div(BigInt.fromI32(20));
      sellInfo.power = attr[1];
      sellInfo.role = attr[2];
      sellInfo.part = attr[3];
      sellInfo.suit = attr[4];
    }

    sellInfo.save();

    let counter = Counter.load(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
    if (!counter) {
      counter = new Counter(sellInfo.nft.toHex() + '-' + sellInfo.token.toHex());
      counter.nft = sellInfo.nft;
      counter.token = sellInfo.token;
    }

    counter.items = counter.items.plus(BigInt.fromI32(1));

    counter.save();
  }
}