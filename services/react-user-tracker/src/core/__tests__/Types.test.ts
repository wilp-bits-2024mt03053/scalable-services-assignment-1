import { TrackerConfig, TrackerProps, UserEvent } from "../Types";

describe("Types", () => {
  it("should allow valid TrackerConfig", () => {
    const config: TrackerConfig = {
      endpointUrl: "http://localhost/api/events",
      batchSize: 10,
      flushInterval: 5000,
      appName: "TestApp",
      appVersion: "1.0.0",
      debug: false,
    };
    expect(config.appName).toBe("TestApp");
  });

  it("should allow valid UserEvent", () => {
    const event: UserEvent = {
      timestamp: Date.now(),
      event_id: "uuid",
      event_type: "CLICK",
      location_type: "COMPONENT",
      component_name: "Btn",
      page_path: "/",
      page_title: "Home",
      user_metadata: {},
    };
    expect(event.event_type).toBe("CLICK");
  });

  it("should allow valid TrackerProps", () => {
    const props: TrackerProps = {
      onClick: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
    };
    props.onClick({} as any);
    expect(props.onClick).toHaveBeenCalled();
  });
});
