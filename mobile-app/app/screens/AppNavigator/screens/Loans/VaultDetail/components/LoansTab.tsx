import React from 'react'
import BigNumber from 'bignumber.js'
import { ThemedText, ThemedView } from '@components/themed'
import { tailwind } from '@tailwind'
import { View } from '@components'
import { SymbolIcon } from '@components/SymbolIcon'
import { IconButton } from '@components/IconButton'
import { translate } from '@translations'
import { LoanVault } from '@store/loans'
import {
  LoanVaultActive,
  LoanVaultState,
  LoanVaultTokenAmount
} from '@defichain/whale-api-client/dist/api/loan'
import { VaultSectionTextRow } from '../../components/VaultSectionTextRow'
import { EmptyLoan } from './EmptyLoan'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { LoanParamList } from '@screens/AppNavigator/screens/Loans/LoansNavigator'
import { useLoanOperations } from '@screens/AppNavigator/screens/Loans/hooks/LoanOperations'

interface LoanCardProps {
  symbol: string
  displaySymbol: string
  amount: string
  interestAmount?: string
  vaultState: LoanVaultState
  vault?: LoanVaultActive
  loanToken: LoanVaultTokenAmount
}

export function LoansTab (props: { vault: LoanVault }): JSX.Element {
  const { vault } = props

  return (
    <ThemedView
      style={tailwind('p-4')}
    >
      {vault.state === LoanVaultState.ACTIVE && vault.loanValue === '0' &&
      (
        <EmptyLoan vaultId={vault.vaultId} />
      )}
      {vault.state === LoanVaultState.IN_LIQUIDATION
        ? (
          vault.batches.map(batch => (
            <LoanCard
              key={batch.loan.id}
              symbol={batch.loan.id}
              displaySymbol={batch.loan.displaySymbol}
              amount={batch.loan.amount}
              vaultState={LoanVaultState.IN_LIQUIDATION}
              loanToken={batch.loan}
            />
          ))
        )
        : (
          vault.loanAmounts.map(loan => (
            <LoanCard
              key={loan.id}
              symbol={loan.symbol}
              displaySymbol={loan.displaySymbol}
              amount={loan.amount}
              interestAmount={vault.interestAmounts.find(interest => interest.symbol === loan.symbol)?.amount}
              vaultState={vault.state}
              vault={vault}
              loanToken={loan}
            />
          ))
        )}

    </ThemedView>
  )
}

function LoanCard (props: LoanCardProps): JSX.Element {
  const canUseOperations = useLoanOperations(props.vault?.state)
  return (
    <ThemedView
      light={tailwind('bg-white border-gray-200')}
      dark={tailwind('bg-gray-800 border-gray-700')}
      style={tailwind('p-4 mb-2 border rounded')}
    >
      <View style={tailwind('flex flex-row items-center')}>
        <SymbolIcon
          symbol={props.displaySymbol} styleProps={{
          width: 16,
          height: 16
        }}
        />
        <ThemedText
          light={tailwind({
            'text-gray-300': props.vaultState === LoanVaultState.IN_LIQUIDATION,
            'text-black': props.vaultState !== LoanVaultState.IN_LIQUIDATION
          })}
          dark={tailwind({
            'text-gray-700': props.vaultState === LoanVaultState.IN_LIQUIDATION,
            'text-white': props.vaultState !== LoanVaultState.IN_LIQUIDATION
          })}
          style={tailwind('font-medium ml-2')}
        >
          {props.displaySymbol}
        </ThemedText>
      </View>
      <View style={tailwind('mt-3')}>
        <VaultSectionTextRow
          value={new BigNumber(props.amount).toFixed(8)}
          lhs={translate('components/VaultDetailsLoansTab', 'Outstanding balance')}
          testID='text_outstanding_balance'
          suffixType='text'
          suffix={` ${props.displaySymbol}`}
          style={tailwind('text-sm font-medium')}
          rhsThemedProps={{
            light: tailwind({
              'text-gray-300': props.vaultState === LoanVaultState.IN_LIQUIDATION,
              'text-black': props.vaultState !== LoanVaultState.IN_LIQUIDATION
            }),
            dark: tailwind({
              'text-gray-700': props.vaultState === LoanVaultState.IN_LIQUIDATION,
              'text-white': props.vaultState !== LoanVaultState.IN_LIQUIDATION
            })
          }}
        />
        {props.vaultState !== LoanVaultState.IN_LIQUIDATION &&
        (
          <VaultSectionTextRow
            value={new BigNumber(props.interestAmount ?? 0).toFixed(8)}
            lhs={translate('components/VaultDetailsLoansTab', 'Interest amount')}
            testID='text_interest_amount'
            suffixType='text'
            suffix={` ${props.displaySymbol}`}
            info={{
              title: 'Interest amount',
              message: 'This amount is the total interest amount from both vault and token interest rate.'
            }}
          />
        )}
      </View>

      {
        canUseOperations && props.vault !== undefined && (
          <ActionButtons vault={props.vault} loanToken={props.loanToken} />
        )
      }
    </ThemedView>
  )
}

function ActionButtons ({
  vault,
  loanToken
}: { vault: LoanVaultActive, loanToken: LoanVaultTokenAmount }): JSX.Element {
  const navigation = useNavigation<NavigationProp<LoanParamList>>()

  return (
    <View
      style={tailwind('mt-4 -mb-2 flex flex-row justify-between')}
    >
      <View style={tailwind('flex flex-row flex-wrap flex-1')}>
        <IconButton
          iconLabel={translate('components/VaultDetailsLoansTab', 'PAYBACK LOAN')}
          style={tailwind('mr-2 mb-2 p-2')}
          onPress={() => {
            navigation.navigate({
              name: 'PaybackLoanScreen',
              merge: true,
              params: {
                vault,
                loanToken
              }
            })
          }}
        />
        <IconButton
          iconLabel={translate('components/VaultDetailsLoansTab', 'BORROW MORE')}
          style={tailwind('mr-2 mb-2 p-2')}
          onPress={() => {
            navigation.navigate({
              name: 'BorrowMoreScreen',
              merge: true,
              params: {
                vault,
                loanTokenAmount: loanToken
              }
            })
          }}
        />
      </View>
    </View>
  )
}
