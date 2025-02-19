import { render } from '@testing-library/react-native'
import * as React from 'react'
import { DexSkeletonLoader } from './DexSkeletonLoader'
import { MnemonicWordSkeletonLoader } from './MnemonicWordSkeletonLoader'
import { TransactionSkeletonLoader } from './TransactionSkeletonLoader'
import { LoanSkeletonLoader } from './LoanSkeletonLoader'

jest.mock('@shared-contexts/ThemeProvider')

describe('Skeleton Loader', () => {
  it('should match snapshot of dex skeleton loader', async () => {
    const component = (
      <DexSkeletonLoader uniqueKey='dex' />
    )
    const rendered = render(component)
    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('should match snapshot of transaction skeleton loader', async () => {
    const component = (
      <TransactionSkeletonLoader uniqueKey='transaction' />
    )
    const rendered = render(component)
    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('should match snapshot of mnemonic word skeleton loader', async () => {
    const component = (
      <MnemonicWordSkeletonLoader uniqueKey='mnemonic_word' />
    )
    const rendered = render(component)
    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('should match snapshot of loan skeleton loader', async () => {
    const component = (
      <LoanSkeletonLoader uniqueKey='loan' />
    )
    const rendered = render(component)
    expect(rendered.toJSON()).toMatchSnapshot()
  })
})
