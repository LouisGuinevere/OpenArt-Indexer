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
import { BigInt, log } from "@graphprotocol/graph-ts";

export function handleArtworkList(event: ArtworkList): void {
  // log.info("Event ArtworkList: sender={}", [event.params.sender.toHexString()]);
  let entity = new ArtworkOrderEntity(event.params.orderHash.toHexString());
  entity.orderHash = event.params.orderHash.toHexString();
  entity.owner = event.params.owner.toHexString();
  entity.tokenId = event.params.tokenId.toI32();
  entity.reservePrice = event.params.reservePrice;
  entity.stepPrice = event.params.stepPrice;
  entity.aunctionDuration = event.params.aunctionDuration;
  entity.aunctionStart = event.params.aunctionStart;
  entity.status = true;
  entity.soldFor = new BigInt(0);
  entity.timestamp = event.params.timestamp;
  entity.save();

  let nftEntity = ArtworkNftEntity.load(event.params.tokenId.toHexString());
  if (nftEntity) {
    nftEntity.order = entity.id;
    nftEntity.save();
  }
}

export function handleArtworkBid(event: ArtworkBid): void {
  log.info("Event ArtworkBid: orderHash={}", [
    event.params.orderHash.toHexString(),
  ]);
  let entity = new ArtworkBidEntity(event.transaction.hash.toHexString());
  entity.orderHash = event.params.orderHash.toHexString();
  entity.bidder = event.params.bidder.toHexString();
  entity.price = event.params.price;
  entity.timestamp = event.params.timestamp;
  entity.save();
  let artworkOrderEntity = ArtworkOrderEntity.load(
    event.params.orderHash.toHexString()
  );
  if (artworkOrderEntity) {
    if (artworkOrderEntity.aunctionStart == BigInt.fromI32(0)) {
      artworkOrderEntity.aunctionStart = event.params.timestamp;
    }
    artworkOrderEntity.soldFor = event.params.price;
    artworkOrderEntity.save();
  }
}

export function handleArtworkClaim(event: ArtworkClaim): void {
  // log.info("Event ArtworkClaim:  sender={}", [
  //   event.params.sender.toHexString(),
  // ]);
  let entity = ArtworkOrderEntity.load(event.params.orderHash.toHexString());
  if (entity != null) {
    entity.status = false;
    entity.save();
    let nftEntity = ArtworkNftEntity.load(
      BigInt.fromI32(entity.tokenId).toHexString()
    );
    if (nftEntity) {
      nftEntity.owner = event.params.claimer.toHexString();
      nftEntity.save();
    }
  }
}

export function handleArtworkWithdraw(event: ArtworkWithdraw): void {
  // log.info("Event ArtworkWithdraw: sender={}", [
  //   event.params.sender.toHexString(),
  // ]);
  let entity = ArtworkOrderEntity.load(event.params.orderHash.toHexString());
  if (entity != null) {
    entity.status = false;
    entity.save();
  }
}

export function handleArtworkMint(event: ArtworkMint): void {
  log.info("Event ArtworkMint", []);
  let entity = new ArtworkNftEntity(event.params.tokenId.toHexString());
  if (entity != null) {
    entity.tokenId = event.params.tokenId.toI32();
    entity.owner = event.params.owner.toHexString();
    entity.creator = event.params.owner.toHexString();
    entity.tokenURI = event.params.tokenURI;
    entity.timestamp = event.params.timestamp;
    entity.save();
  }
}
