import { TokenInfo } from '@defichain/jellyfish-api-core/dist/category/token'
import { PlaygroundRpcClient } from '@defichain/playground-api-client'
import React, { useEffect, useState } from 'react'
import { View } from '@components/index'
import { usePlaygroundContext } from '@contexts/PlaygroundContext'
import { useWalletContext } from '@shared-contexts/WalletContext'
import { PlaygroundAction } from '../components/PlaygroundAction'
import { PlaygroundTitle } from '../components/PlaygroundTitle'

export function PlaygroundToken (): JSX.Element | null {
  const { wallet } = useWalletContext()
  const {
    rpc,
    api
  } = usePlaygroundContext()
  const [status, setStatus] = useState<string>('loading')
  const [tokens, setTokens] = useState<PlaygroundTokenInfo[]>([])

  useEffect(() => {
    getTokens(rpc).then(value => {
      setTokens(value)
      setStatus('online')
    }).catch(() => {
      setStatus('error')
    })
  }, [wallet])

  const actions = tokens.filter(({ symbol }) => symbol !== 'DFI').map(token => {
    return (
      <PlaygroundAction
        key={token.id}
        onPress={async () => {
          const address = await wallet.get(0).getAddress()
          await rpc.call('sendtokenstoaddress', [{}, {
            [address]: `10@${token.symbol}`
          }], 'number')
        }}
        testID={`playground_token_${token.symbol}`}
        title={`Top up 10.0 ${token.symbol} to Wallet`}
      />
    )
  })

  return (
    <View>
      <PlaygroundTitle
        status={{
          online: status === 'online',
          loading: status === 'loading',
          error: status === 'error'
        }}
        title='Token'
      />

      <PlaygroundAction
        key='0'
        onPress={async () => {
          await api.wallet.sendTokenDfiToAddress({
            amount: '10',
            address: await wallet.get(0).getAddress()
          })
        }}
        testID='playground_token_DFI'
        title='Top up 10.0 DFI to Wallet'
      />

      {actions}
    </View>
  )
}

export type PlaygroundTokenInfo = TokenInfo & { id: string }

async function getTokens (rpcClient: PlaygroundRpcClient): Promise<PlaygroundTokenInfo[]> {
  const result = await rpcClient.token.listTokens()

  return Object.entries(result).map(([id, info]) => {
    return { id, ...info }
  }).sort(a => Number.parseInt(a.id))
}
