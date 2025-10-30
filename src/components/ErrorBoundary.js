import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: 700,
          margin: "3em auto",
          fontFamily: "sans-serif",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 7px 32px rgba(255,112,0,0.11)",
          padding: "2em",
          border: "2.5px solid #ff7000",
          textAlign: "center"
        }}>
          <h2 style={{ color: "#ff7000" }}>Something went wrong</h2>
          <p>The application encountered an unexpected error. Please refresh the page to try again.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: "#ff7000",
              color: "#fff",
              border: "none",
              padding: "0.8em 1.5em",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: "1em", textAlign: "left" }}>
              <summary>Error Details (Development Mode)</summary>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.8em", color: "#666" }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
