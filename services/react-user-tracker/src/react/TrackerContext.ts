import React from "react";

import { EventTracker } from "../core";

export const TrackerContext = React.createContext<EventTracker | null>(null);
