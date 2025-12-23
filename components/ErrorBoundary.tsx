import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  // Explicitly defining children as optional ReactNode to satisfy React 18+ type requirements
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Standard React Error Boundary class component.
 * Captures UI-level crashes and displays a graceful fallback screen.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  // Fix: Declare props and state explicitly to ensure they are correctly recognized by the TypeScript compiler when inheriting from generic React.Component
  public props: Props;
  public state: State;

  // Fix: Explicitly define the constructor and call super(props) to ensure this.state and this.props are properly initialized and available
  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    // Fix: Access properties through 'this' which are now explicitly typed and correctly recognized by inheriting from React.Component
    const { children } = this.props;
    const { hasError, error } = this.state;

    // Fix: Access state variables safely via the destructured state object
    if (hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-500 mb-6">
              Our AI encountered an unexpected state. We've logged this issue.
            </p>
            
            {/* Fix: Safely display error details if available, using recognized state properties */}
            {error && (
                <div className="mb-6 p-3 bg-slate-100 rounded-lg text-xs text-slate-600 font-mono text-left overflow-auto max-h-32">
                    {error.toString()}
                </div>
            )}

            <div className="flex gap-3 justify-center">
              <button 
                onClick={this.handleGoHome}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Home size={18} /> Home
              </button>
              <button 
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <RefreshCw size={18} /> Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
