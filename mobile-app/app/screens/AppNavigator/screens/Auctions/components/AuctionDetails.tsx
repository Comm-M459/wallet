import React from 'react'
import { ThemedIcon, ThemedSectionTitle, ThemedText, ThemedView } from '@components/themed'
import { View, TouchableOpacity } from 'react-native'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import BigNumber from 'bignumber.js'
import { NumberRow } from '@components/NumberRow'
import { LoanVaultLiquidated, LoanVaultLiquidationBatch } from '@defichain/whale-api-client/dist/api/loan'
import { openURL } from '@api/linking'
import { useDeFiScanContext } from '@shared-contexts/DeFiScanContext'
import { TextRow } from '@components/TextRow'
import { useAuctionTime } from '../hooks/AuctionTimeLeft'
import { useSelector } from 'react-redux'
import { RootState } from '@store'
import { useAuctionBidValue } from '../hooks/AuctionBidValue'
import { getActivePrice } from '../helpers/ActivePrice'

export function AuctionDetails (props: { vault: LoanVaultLiquidated, batch: LoanVaultLiquidationBatch }): JSX.Element {
  const { vault, batch } = props
  const blockCount = useSelector((state: RootState) => state.block.count)
  const { getVaultsUrl, getAddressUrl } = useDeFiScanContext()
  const { startTime } = useAuctionTime(vault.liquidationHeight, blockCount ?? 0)
  const { minStartingBidInToken } = useAuctionBidValue(batch, vault.liquidationPenalty, vault.loanScheme.interestRate)

  const collateralValue = batch.collaterals.reduce((total, eachItem) => {
    return total.plus(new BigNumber(eachItem.amount).multipliedBy(getActivePrice(eachItem)))
  }, new BigNumber(0))

  return (
    <>
      <ThemedSectionTitle
        testID='auction_details'
        text={translate('screens/AuctionDetails', 'VAULT DETAILS')}
      />

      <RowLinkItem
        label={translate('components/AuctionDetails', 'Vault ID')}
        value={vault.vaultId}
        onPress={async () => await openURL(getVaultsUrl(vault.vaultId))}
      />

      <RowLinkItem
        label={translate('components/AuctionDetails', 'Owner ID')}
        value={vault.ownerAddress}
        onPress={async () => await openURL(getAddressUrl(vault.ownerAddress))}
      />

      <NumberRow
        lhs={translate('components/AuctionDetails', 'Liquidation height')}
        rhs={{
          value: vault.liquidationHeight,
          testID: 'text_liquidation_height'
        }}
      />

      <ThemedSectionTitle
        testID='vault_details'
        text={translate('screens/AuctionDetails', 'ADDITIONAL DETAILS')}
      />

      <NumberRow
        lhs={translate('components/AuctionDetails', 'Collateral value (USD)')}
        rhs={{
          value: new BigNumber(collateralValue).toFixed(2),
          testID: 'text_collateral_value',
          prefix: '$'
        }}
      />

      <NumberRow
        lhs={translate('components/AuctionDetails', 'Min. starting bid')}
        rhs={{
          suffix: batch.loan.displaySymbol,
          suffixType: 'text',
          value: minStartingBidInToken,
          testID: 'text_min_starting_bid'
        }}
      />

      <TextRow
        lhs={translate('components/AuctionDetails', 'Auction start')}
        rhs={{
          value: startTime,
          testID: 'auction_start'
        }}
        textStyle={tailwind('text-sm font-normal')}
      />
    </>
  )
}

function RowLinkItem (props: {label: string, value: string, onPress: () => void }): JSX.Element {
  return (
    <ThemedView
      dark={tailwind('bg-gray-800 border-b border-gray-700')}
      light={tailwind('bg-white border-b border-gray-200')}
      style={tailwind('p-4 flex-row items-center w-full')}
    >
      <View style={tailwind('w-5/12')}>
        <View style={tailwind('flex-row items-center justify-start')}>
          <ThemedText style={tailwind('text-sm font-normal')}>
            {props.label}
          </ThemedText>
        </View>
      </View>

      <View style={tailwind('flex-1')}>
        <View style={tailwind('flex flex-row items-center ')}>
          <ThemedText
            dark={tailwind('text-gray-400')}
            light={tailwind('text-gray-500')}
            style={tailwind('text-right w-11/12 text-sm font-normal')}
            numberOfLines={1}
            ellipsizeMode='middle'
          >
            {props.value}
          </ThemedText>
          <TouchableOpacity
            onPress={props.onPress}
            testID='ocean_vault_explorer'
          >
            <ThemedIcon
              dark={tailwind('text-darkprimary-500')}
              iconType='MaterialIcons'
              light={tailwind('text-primary-500')}
              name='open-in-new'
              style={tailwind('text-right ml-1')}
              size={16}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  )
}
