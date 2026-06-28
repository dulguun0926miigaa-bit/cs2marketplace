import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for debugging; swap with a real error reporting service if needed
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <p className="text-6xl mb-4">💥</p>
          <h1 className="text-2xl font-bold mb-2">Гэнэтийн алдаа гарлаа</h1>
          <p className="text-gray-400 mb-2 max-w-md">
            Уучлаарай, хуудсыг ачааллахад алдаа гарлаа. Хуудсыг дахин ачаалах эсвэл нүүр хуудас руу буцна уу.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="text-xs text-red-400 bg-red-900/20 rounded p-3 mb-4 max-w-xl text-left overflow-auto">
              {this.state.error.toString()}
            </pre>
          )}
          <button onClick={this.handleReload} className="btn-primary mt-2">
            Нүүр хуудас руу буцах
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
