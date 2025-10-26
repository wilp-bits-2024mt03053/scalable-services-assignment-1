import React from "react";

import { fireEvent, render } from "@testing-library/react";

import { TrackerConfig } from "../../core/Types";
import { useTracker } from "../useTracker";

describe("useTracker", () => {
  const config: TrackerConfig = {
    endpointUrl: "http://localhost/api/events",
    batchSize: 2,
    flushInterval: 1000,
    appName: "TestApp",
    appVersion: "0.1.0",
    debug: true,
  };

  // Removed property checks; React does not expose event handlers on DOM nodes

  it("should call event handlers when events are fired", () => {
    const mockTrackEvent = jest.fn();
    jest
      .spyOn(React, "useContext")
      .mockReturnValue({ trackEvent: mockTrackEvent });
    const TestButton = () => {
      const tracker = useTracker("TestButton");
      return (
        <button data-testid="btn" {...tracker}>
          Click
        </button>
      );
    };
    const { getByTestId } = render(<TestButton />);
    const btn = getByTestId("btn");
    fireEvent.click(btn);
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(mockTrackEvent).toHaveBeenCalledTimes(3);
    (React.useContext as jest.Mock).mockRestore();
  });
});
