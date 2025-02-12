import React from 'react'
import { View } from 'react-native'
import { translate } from '@translations'
import { tailwind } from '@tailwind'
import { ThemedIcon, ThemedText } from '@components/themed'
import { TransactionCloseButton } from './TransactionCloseButton'

interface TransactionErrorProps {
  errMsg: string
  onClose: () => void
}

enum ErrorCodes {
  UnknownError = 0,
  InsufficientUTXO = 1,
  InsufficientBalance = 2,
  PoolSwapHigher = 3,
  InsufficientDFIInVault = 4,
  LackOfLiquidity = 5,
  PaybackLoanInvalidPrice = 6,
  NoLiveFixedPrices = 7,
  VaultNotEnoughCollateralization = 8
}

interface ErrorMapping {
  code: ErrorCodes
  message: string
}

export function TransactionError ({
  errMsg,
  onClose
}: TransactionErrorProps): JSX.Element {
  console.log('transaction error', errMsg)
  const err = errorMessageMapping(errMsg)
  return (
    <>
      <ThemedIcon
        dark={tailwind('text-darkerror-500')}
        iconType='MaterialIcons'
        light={tailwind('text-error-500')}
        name='error'
        size={20}
      />

      <View style={tailwind('flex-auto mx-3 justify-center')}>
        <ThemedText
          style={tailwind('text-sm font-bold')}
        >
          {translate('screens/OceanInterface', `Error Code: ${err.code}`)}
        </ThemedText>

        <ThemedText
          ellipsizeMode='tail'
          numberOfLines={1}
          style={tailwind('text-sm font-bold')}
        >
          {translate('screens/OceanInterface', err.message)}
        </ThemedText>
      </View>

      <TransactionCloseButton onPress={onClose} />
    </>
  )
}

function errorMessageMapping (err: string): ErrorMapping {
  if (err === 'not enough balance after combing all prevouts') {
    return {
      code: ErrorCodes.InsufficientUTXO,
      message: 'Insufficient UTXO DFI'
    }
  } else if (err.includes('amount') && err.includes('is less than')) {
    return {
      code: ErrorCodes.InsufficientBalance,
      message: 'Not enough balance'
    }
  } else if (err.includes('Price is higher than indicated.')) {
    return {
      code: ErrorCodes.PoolSwapHigher,
      message: 'Price is higher than indicated'
    }
  } else if (err.includes('no prevouts available to create a transaction')) {
    return {
      code: ErrorCodes.InsufficientUTXO,
      message: 'Insufficient UTXO DFI'
    }
  } else if (err.includes('At least 50% of the vault must be in DFI when taking a loan')) {
    return {
      code: ErrorCodes.InsufficientDFIInVault,
      message: 'Insufficient DFI collateral (≥50%)'
    }
  } else if (err.includes('Lack of liquidity')) {
    return {
      code: ErrorCodes.LackOfLiquidity,
      message: 'Pool does not have enough liquidity'
    }
  } else if (err.includes('Cannot payback loan while any of the asset\'s price is invalid')) {
    return {
      code: ErrorCodes.PaybackLoanInvalidPrice,
      message: 'Cannot payback loan due to invalid price'
    }
  } else if (err.includes('No live fixed prices')) {
    return {
      code: ErrorCodes.NoLiveFixedPrices,
      message: 'No live fixed prices for loan token'
    }
  } else if (err.includes('Vault does not have enough collateralization ratio defined by loan scheme')) {
    return {
      code: ErrorCodes.VaultNotEnoughCollateralization,
      message: 'Vault does not have enough col. ratio'
    }
  }

  return {
    code: ErrorCodes.UnknownError,
    message: err
  }
}
