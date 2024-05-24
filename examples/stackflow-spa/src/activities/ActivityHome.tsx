import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";

import { useFlow } from "../stackflow";

const ActivityHome: ActivityComponentType = () => {
  const { push } = useFlow();

  return (
    <AppScreen appBar={{ title: "Home" }}>
      <div style={{ overflow: "auto", height: "100vh" }}>
        <h1>Home</h1>
        <div>
          <a
            href="/detail"
            onClick={(e) => {
              e.preventDefault();
              push("ActivityDetail", {});
            }}
          >
            Go to detail
          </a>
          <div style={{ height: 8000 }}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat ea
            vel corrupti suscipit minima officia tempore quae? Dolor placeat
            necessitatibus laudantium, aut in nulla eos velit assumenda eveniet
            impedit ratione.
          </div>
        </div>
      </div>
    </AppScreen>
  );
};

export default ActivityHome;
