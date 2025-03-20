import { Fragment, type RefObject, useEffect, useRef, useState } from 'react';
import { Flex, Tabs, theme } from 'antd';
import { useResizeObserver } from 'usehooks-ts';
import { CloseOutlined } from '@ant-design/icons';
import { history, useLocation } from '@umijs/max';
import settings from '../../../config/defaultSettings';
import type { LocalRoute } from './store';
import { findRoute, getMenuFromSession, saveMenuToSession } from './store';
import './index.less';

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
  const [tabs, setTabs] = useState<LocalRoute[]>([]);
  const { width = 0 } = useResizeObserver({
    ref: ref as RefObject<HTMLElement>,
    box: 'border-box',
  });

  if (!keepAliveTabs) {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!tabs.find((tab) => tab.path === location.pathname)) {
      const currentRoute = findRoute();
      if (currentRoute) {
        const newTabs = [...tabs, currentRoute];
        setTabs(newTabs);
        saveMenuToSession(currentRoute);
      }
    }
    setActiveKey(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const menus = getMenuFromSession();
    setTabs(menus);
  }, []);

  const removeTab = (targetKey: string) => {
    const newTabs = tabs.filter((tab) => tab.key !== targetKey);
    const lastTabKey = newTabs[newTabs.length - 1]?.key;
    setTabs(newTabs);
    if (targetKey === activeKey && lastTabKey) {
      history.push(lastTabKey);
    }
  };

  return (
    <div className={'keep-alive-tabs'} ref={ref}>
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
            type={'card'}
            activeKey={activeKey}
            onChange={(key) => history.push(key)}
            items={tabs.map((tab) => ({
              ...tab,
              icon: null,
              label: (
                <Flex key={tab.key}>
                  {tab.name}
                  {keepAliveRemoveUnused && (
                    <CloseOutlined
                      style={{ fontSize: 12, marginLeft: 4 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTab(tab.key);
                      }}
                    />
                  )}
                </Flex>
              ),
              children: <Fragment />,
            }))}
          />
        </div>
      )}
      <div className="tabs-content">{children}</div>
    </div>
  );
}
