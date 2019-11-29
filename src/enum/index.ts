/*
 * Copyright ©️ 2018 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 *  [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

export enum KeyPairType {
  Cyber = 'cyber',
  Cosmos = 'cosmos',
  Ether = 'ether',
  Binance = 'binance',
  Irisnet = 'irisnet',
  Terra = 'terra',
}

export enum NetworkType {
  Geesome = 'geesome',
  CyberD = 'cyberd',
  Cosmos = 'cosmos',
  Ethereum = 'ethereum',
  BinanceChain = 'binance-chain',
  Irisnet = 'irisnet',
  Terra = 'terra',
}

export enum StorageVars {
  Ready = 'ready',
  EncryptedSeed = 'encryptedSeed',
  Path = 'path',
  Query = 'query',
  CurrentAccountGroup = 'accountGroup:current',
  CurrentAccountItem = 'account:current',
  CurrentAccountList = 'account:list',
  AccountsGroups = 'accounts:groups',
  AllAccounts = 'accounts:all',
  IpfsUrl = 'ipfs:url',
  CurrentCabinetRoute = 'cabinet:current',
  Settings = 'settings',
}
