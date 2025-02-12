import { DexItem, tokensSelector, wallet, WalletState, WalletToken } from './wallet'

describe('wallet reducer', () => {
  let initialState: WalletState
  let tokenDFI: WalletToken
  let utxoDFI: WalletToken
  let unifiedDFI: WalletToken

  beforeEach(() => {
    initialState = {
      tokens: [],
      utxoBalance: '0',
      poolpairs: []
    }
    tokenDFI = {
      id: '0',
      amount: '100000',
      isDAT: true,
      isLPS: false,
      name: 'DeFiChain',
      symbol: 'DFI',
      symbolKey: 'DFI',
      displaySymbol: 'DFI (Token)',
      avatarSymbol: 'DFI (Token)'
    }
    utxoDFI = {
      ...tokenDFI,
      amount: '0',
      id: '0_utxo',
      displaySymbol: 'DFI (UTXO)',
      avatarSymbol: 'DFI (UTXO)'
    }
    unifiedDFI = {
      ...tokenDFI,
      amount: '0',
      id: '0_unified',
      displaySymbol: 'DFI',
      avatarSymbol: 'DFI'
    }
  })

  it('should handle initial state', () => {
    expect(wallet.reducer(undefined, { type: 'unknown' })).toEqual({
      utxoBalance: '0',
      tokens: [],
      poolpairs: []
    })
  })

  it('should handle setTokens', () => {
    const tokens: WalletToken[] = [tokenDFI, utxoDFI]
    const actual = wallet.reducer(initialState, wallet.actions.setTokens(tokens))
    expect(actual.tokens).toStrictEqual(tokens)
  })

  it('should handle setUtxoBalance', () => {
    const utxoAmount = '77'
    const actual = wallet.reducer(initialState, wallet.actions.setUtxoBalance(utxoAmount))
    expect(actual.utxoBalance).toStrictEqual('77')
  })

  it('should handle setPoolpairs', () => {
    const payload: DexItem[] = [{
      type: 'available',
      data: {
        id: '8',
        symbol: 'DFI-USDT',
        name: 'Default Defi token-Playground USDT',
        status: 'true',
        tokenA: {
          id: '0',
          reserve: '1000',
          blockCommission: '0',
          symbol: 'DFI',
          displaySymbol: 'dDFI'
        },
        tokenB: {
          id: '3',
          reserve: '10000000',
          blockCommission: '0',
          symbol: 'USDT',
          displaySymbol: 'dUSDT'
        },
        priceRatio: {
          ab: '0.0001',
          ba: '10000'
        },
        commission: '0',
        totalLiquidity: {
          token: '100000',
          usd: '20000000'
        },
        tradeEnabled: true,
        ownerAddress: 'mswsMVsyGMj1FzDMbbxw2QW3KvQAv2FKiy',
        rewardPct: '0.2',
        creation: {
          tx: 'f691c8b0a5d362a013a7207228e618d832c0b99af8da99c847923f5f93136d60',
          height: 119
        },
        apr: {
          reward: 133.7652,
          total: 133.7652
        }
      }
    }]
    const actual = wallet.reducer(initialState, wallet.actions.setPoolPairs(payload))
    expect(actual.poolpairs).toStrictEqual(payload)
  })

  it('should able to select tokens with default DFIs', () => {
    const actual = tokensSelector({
      ...initialState,
      utxoBalance: '77'
    })
    expect(actual).toStrictEqual([{
      ...utxoDFI,
      amount: '77.00000000'
    }, {
      ...tokenDFI,
      amount: '0'
    }, {
      ...unifiedDFI,
      amount: '77.00000000'
    }])
  })

  it('should able to select tokens with existing DFI Token', () => {
    const btc = {
      id: '1',
      isLPS: false,
      name: 'Bitcoin',
      isDAT: true,
      symbol: 'BTC',
      symbolKey: 'BTC',
      amount: '1',
      displaySymbol: 'BTC',
      avatarSymbol: 'BTC'
    }
    const state = {
      ...initialState,
      utxoBalance: '77.00000000',
      tokens: [{ ...utxoDFI }, { ...tokenDFI }, { ...unifiedDFI }, { ...btc }]
    }
    const actual = tokensSelector(state)
    expect(actual).toStrictEqual([
      {
        ...utxoDFI,
        amount: '77.00000000'
      },
      { ...tokenDFI },
      {
        ...unifiedDFI,
        amount: '100077.00000000'
      },
      { ...btc }])
  })
})
