import React from "react";

import { render } from "@testing-library/react";

import { TrackerContext } from "../TrackerContext";

describe("TrackerContext", () => {
  it("should have default value null", () => {
    let contextValue: import("../../core/EventTracker").EventTracker | null =
      "not-null" as any;
    const TestComponent = () => {
      contextValue = React.useContext(TrackerContext);
      return <div>Test</div>;
    };
    render(<TestComponent />);
    expect(contextValue).toBeNull();
  });
});
