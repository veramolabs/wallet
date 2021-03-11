export const BRIDGE_IFRAME_NAME = 'HW-IFRAME'
export const BRIDGE_REPLEY_PREFIX = 'reply'

export const LEDGER_BITCOIN_OPTIONS = [
  {
    name: 'bitcoin_ledger_nagive_segwit',
    label: 'Segwit',
    addressType: 'bech32'
  },
  {
    name: 'bitcoin_ledger_legacy',
    label: 'Legacy',
    addressType: 'legacy'
  }
]

export const LEDGER_OPTIONS = [
  {
    name: 'ETH',
    label: 'ETH',
    type: 'ethereum_ledger',
    chain: 'ETH'
  },
  {
    name: 'BTC',
    label: 'BTC',
    type: 'bitcoin_ledger_nagive_segwit',
    chain: 'BTC'
  }
]