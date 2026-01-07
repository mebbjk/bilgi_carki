
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Hata Yakalayıcı Bileşen
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uygulama Hatası:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          padding: '20px', 
          fontFamily: 'sans-serif', 
          textAlign: 'center',
          backgroundColor: '#fef2f2',
          color: '#991b1b'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Üzgünüz, bir sorun oluştu.</h1>
          <p style={{ marginBottom: '20px' }}>Uygulama beklenmedik bir hatayla karşılaştı.</p>
          <pre style={{ 
            backgroundColor: '#fff', 
            padding: '10px', 
            borderRadius: '5px', 
            border: '1px solid #fecaca', 
            marginBottom: '20px',
            maxWidth: '100%',
            overflowX: 'auto',
            fontSize: '12px'
          }}>
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
