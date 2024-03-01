import {
  ArtworkList,
  ArtworkBid,
  ArtworkClaim,
  ArtworkMint,
  ArtworkWithdraw,
} from "../../generated/Marketplace/Marketplace";
import {
  ArtworkNftEntity,
  ArtworkOrderEntity,
  ArtworkBidEntity,
} from "../../generated/schema";
import { log } from "@graphprotocol/graph-ts";

export function handleArtworkList(event: ArtworkList): void {
  // log.info("Event ArtworkList: sender={}", [event.params.sender.toHexString()]);
  const id = event.transaction.hash.toHex();
  let entity = new ArtworkOrderEntity(id);
  entity.orderHash = event.params.orderHash.toHexString();
  entity.owner = event.params.owner.toHexString();
  entity.tokenId = event.params.tokenId.toI32();
  entity.reservePrice = event.params.reservePrice;
  entity.stepPrice = event.params.stepPrice;
  entity.aunctionDuration = event.params.aunctionDuration;
  entity.aunctionStart = event.params.aunctionStart;
  entity.status = true;
  entity.save();
}

export function handleArtworkBid(event: ArtworkBid): void {
  // log.info("Event ArtworkBid: sender={}, success={}", [
  //   event.params.sender.toHexString(),
  //   event.params.success.toString(),
  // ]);
  const id = event.transaction.hash.toHex();
  let entity = ArtworkBidEntity.load(id);
  if (entity == null) {
    entity = new ArtworkBidEntity(id);
  } else {
    entity.bidder = event.params.bidder.toHexString();
    entity.price = event.params.price;
    entity.save();
  }
}

export function handleArtworkClaim(event: ArtworkClaim): void {
  // log.info("Event ArtworkClaim: sender={}", [
  //   event.params.sender.toHexString(),
  // ]);
  const id = event.transaction.hash.toHex();
  let entity = new ArtworkOrderEntity(id);
  if (entity != null) {
    entity.status = false;
    entity.save();
  }
}

export function handleArtworkWithdraw(event: ArtworkWithdraw): void {
  // log.info("Event ArtworkWithdraw: sender={}", [
  //   event.params.sender.toHexString(),
  // ]);
  const id = event.transaction.hash.toHex();
  let entity = new ArtworkOrderEntity(id);
  if (entity != null) {
    entity.status = false;
    entity.save();
  }
}

export function handleArtworkMint(event: ArtworkMint): void {
  log.info("Event ArtworkMint", []);
  const id = event.transaction.hash.toHex();
  let entity = new ArtworkNftEntity(id);
  if (entity != null) {
    entity.tokenId = event.params.tokenId.toI32();
    entity.owner = event.params.owner.toHexString();
    entity.tokenURI = event.params.tokenURI;
    entity.save();
  }
}
