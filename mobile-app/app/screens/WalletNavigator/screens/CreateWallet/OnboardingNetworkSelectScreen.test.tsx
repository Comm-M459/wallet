import { render } from '@testing-library/react-native'
import * as React from 'react'
import { OnboardingNetworkSelectScreen } from './OnboardingNetworkSelectScreen'

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}))

jest.mock('@shared-contexts/NetworkContext')
jest.mock('@shared-contexts/ThemeProvider')

describe('network selection screen', () => {
  it('should render', async () => {
    const rendered = render(<OnboardingNetworkSelectScreen />)
    expect(rendered.toJSON()).toMatchSnapshot()
  })
})
