## Subgraphs

**[Sacred Realm NFT](https://thegraph.com/explorer/subgraph/sealemlab/sacredrealm-nft)**: Tracks all Sacred Realm NFT.

**[Sacred Realm Box](https://thegraph.com/explorer/subgraph/sealemlab/sacredrealm-box)**: Tracks all Sacred Realm Box.

**[Market](https://thegraph.com/explorer/subgraph/sealemlab/market)**: Tracks all NFTs in market.

**[Inviting](https://thegraph.com/explorer/subgraph/sealemlab/inviting)**: Tracks all inviting events.

## Dependencies

- [Graph CLI](https://github.com/graphprotocol/graph-cli)
    - Required to generate and build local GraphQL dependencies.

```shell
npm install -g @graphprotocol/graph-cli
```

## Deployment

1. Run `graph auth` to authenticate with your deploy key.

2. Type `cd subgraphs/[subgraph]` to enter the subgraph.

3. Run the `graph codegen` command to prepare the TypeScript sources for the GraphQL (generated/*).

4. Run the `graph build` command to build the subgraph, and check compilation errors before deploying.

5. Run `graph deploy --product hosted-service sealemlab/[subgraph]` to deploy the subgraph.