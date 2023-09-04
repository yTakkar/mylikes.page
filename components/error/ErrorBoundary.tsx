import React from 'react'
import Error from './Error'
import appAnalytics from '../../lib/analytics/appAnalytics'
import { ErrorInfo } from 'react'

interface IErrorBoundaryProps {
  children: React.ReactNode
}

interface IErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.PureComponent<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    appAnalytics.captureException(error, {
      extra: {
        stack: errorInfo,
      },
    })
  }

  render() {
    console.log('Error Boundary')

    if (this.state.hasError) {
      return <Error shelf={null} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
