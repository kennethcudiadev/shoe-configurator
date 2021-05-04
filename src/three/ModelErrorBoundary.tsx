import { Component, type ReactNode } from "react";
import { FallbackShoe } from "./FallbackShoe";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ModelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FallbackShoe />;
    }
    return this.props.children;
  }
}
