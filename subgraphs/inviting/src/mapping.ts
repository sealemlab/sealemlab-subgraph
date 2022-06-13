import { BigInt } from '@graphprotocol/graph-ts'
import { BindInviter } from '../generated/Inviting/Inviting'
import { Counter } from '../generated/schema'

export function handleBindInviter(event: BindInviter): void {
  let counter = Counter.load(event.params.inviter.toHex());
  if (!counter) {
    counter = new Counter(event.params.inviter.toHex());
    counter.inviter = event.params.inviter;
  }

  counter.usersCount = counter.usersCount.plus(BigInt.fromI32(1));

  counter.save();
}