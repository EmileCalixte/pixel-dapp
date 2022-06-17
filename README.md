# Pixel DApp

A personal training to develop a decentralized application

## Run project

```bash
docker compose up
```

## Run tests

```bash
docker compose exec hardhat npx hardhat test
```

## Deploy contract on local network

```bash
docker compose exec hardhat npx hardhat run --network localhost scripts/deploy.js
```
