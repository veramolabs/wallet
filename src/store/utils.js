import Vue from 'vue'
import { random, findKey, mapKeys, mapValues } from 'lodash-es'
import axios from 'axios'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { BitcoinNetworks } from '@liquality/bitcoin-networks'
import { EthereumNetworks } from '@liquality/ethereum-networks'
import { NearNetworks } from '@liquality/near-networks'
import { Client } from '@liquality/client'
import { EthereumRpcProvider } from '@liquality/ethereum-rpc-provider'

export const CHAIN_LOCK = {}

export const emitter = new Vue()

const wait = (millis) => new Promise(resolve => setTimeout(() => resolve(), millis))

export { wait }

export const waitForRandom = (min, max) => wait(random(min, max))

export const timestamp = () => Date.now()

export const attemptToLockAsset = (network, walletId, asset) => {
  const chain = cryptoassets[asset].chain
  const key = [network, walletId, chain].join('-')

  if (CHAIN_LOCK[key]) {
    return {
      key,
      success: false
    }
  }

  CHAIN_LOCK[key] = true

  return {
    key,
    success: true
  }
}

export const unlockAsset = key => {
  CHAIN_LOCK[key] = false

  emitter.$emit(`unlock:${key}`)
}

const COIN_GECKO_API = 'https://api.coingecko.com/api/v3'

export const getLegacyRskBalance = async (accounts) => {
  const walletIds = Object.keys(accounts)

  const addresses = []

  walletIds.forEach((wallet) => {
    const walletAccounts = accounts[wallet].mainnet

    walletAccounts.forEach(account => {
      if (account.chain === 'rsk') {
        addresses.push(...account.addresses)
      }
    })
  })

  const client = new Client()
    .addProvider(
      new EthereumRpcProvider({ uri: 'https://public-node.rsk.co' })
    )

  return await client._chain.getBalance(addresses)
}

export async function getPrices (baseCurrencies, toCurrency) {
  const coindIds = baseCurrencies.filter(currency => cryptoassets[currency]?.coinGeckoId)
    .map(currency => cryptoassets[currency].coinGeckoId)
  const { data } = await axios.get(`${COIN_GECKO_API}/simple/price?ids=${coindIds.join(',')}&vs_currencies=${toCurrency}`)
  let prices = mapKeys(data, (v, coinGeckoId) => findKey(cryptoassets, asset => asset.coinGeckoId === coinGeckoId))
  prices = mapValues(prices, rates => mapKeys(rates, (v, k) => k.toUpperCase()))

  for (const baseCurrency of baseCurrencies) {
    if (!prices[baseCurrency] && cryptoassets[baseCurrency].matchingAsset) {
      prices[baseCurrency] = prices[cryptoassets[baseCurrency].matchingAsset]
    }
  }
  const symbolPrices = mapValues(prices, rates => rates[toCurrency.toUpperCase()])
  return symbolPrices
}

export const Networks = ['mainnet', 'testnet']

export const ChainNetworks = {
  bitcoin: {
    testnet: BitcoinNetworks.bitcoin_testnet,
    mainnet: BitcoinNetworks.bitcoin
  },
  ethereum: {
    testnet: EthereumNetworks.ropsten,
    mainnet: EthereumNetworks.ethereum_mainnet
  },
  rsk: {
    testnet: EthereumNetworks.rsk_testnet,
    mainnet: EthereumNetworks.rsk_mainnet
  },
  bsc: {
    testnet: EthereumNetworks.bsc_testnet,
    mainnet: EthereumNetworks.bsc_mainnet
  },
  polygon: {
    testnet: EthereumNetworks.polygon_testnet,
    mainnet: EthereumNetworks.polygon_mainnet
  },
  arbitrum: {
    testnet: EthereumNetworks.arbitrum_testnet,
    mainnet: EthereumNetworks.arbitrum_mainnet
  },
  near: {
    testnet: NearNetworks.near_testnet,
    mainnet: NearNetworks.near_mainnet
  }
}
