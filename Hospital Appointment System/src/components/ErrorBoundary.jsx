import { Component } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="m-6 rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-800">
          <div className="flex items-center gap-3 text-lg font-bold">
            <FiAlertTriangle /> Something went wrong
          </div>
          <p className="mt-2 text-sm">Refresh the page or restore demo data from the dashboard.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
