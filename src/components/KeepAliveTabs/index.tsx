import settings from "../../../config/defaultSettings";
import routes from "../../../config/routes";
import "./index.less";
import { treeToArray } from "@dimjs/utils";
import { history, useLocation } from "@umijs/max";
import { Tabs, theme } from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";

export default function KeepAliveTabs({
  children,
}: {
  children: React.ReactNode;
}) {
  const { keepAliveTabs = true, keepAliveRemoveUnused = false } = settings;
  const { token } = theme.useToken();
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.pathname);
  const [tabs, setTabs] = useState<{ label: string; key: string }[]>([]);
  const { width = 0 } = useResizeObserver({
    ref,
    box: "border-box",
  });

  if (!keepAliveTabs) {
    return <>{children}</>;
  }

  const findRouteName = () => {
    const routeArr = treeToArray<any, "routes">(routes, "routes");
    const route = routeArr.find((route) => route.path === location.pathname);
    return route?.name;
  };

  useEffect(() => {
    if (!tabs.find((tab) => tab.key === location.pathname)) {
      const routeName = findRouteName();
      console.log(routeName);
      setTabs([
        ...tabs,
        {
          label: routeName || document.title || location.pathname,
          key: location.pathname,
        },
      ]);
    }
    setActiveKey(location.pathname);
  }, [location.pathname]);

  const removeTab = (targetKey: string) => {
    const newTabs = tabs.filter((tab) => tab.key !== targetKey);
    setTabs(newTabs);
    if (targetKey === activeKey) {
      history.push(newTabs[newTabs.length - 1]?.key);
    }
  };

  console.log(token);

  return (
    <div className={"keep-alive-tabs"} ref={ref}>
      {tabs.length > 1 && (
        <div
          className="tabs-container"
          style={{
            backgroundColor: token.colorBgLayout,
            width: width,
          }}
        >
          <Tabs
            size="small"
            className="tabs"
            type={keepAliveRemoveUnused ? "editable-card" : "card"}
            onEdit={(targetKey) => {
              removeTab(targetKey as string);
            }}
            activeKey={activeKey}
            onChange={(key) => history.push(key)}
            items={tabs.map((tab) => ({
              ...tab,
              children: <Fragment />,
            }))}
          />
        </div>
      )}
      <div className="tabs-content">{children}</div>
    </div>
  );
}
