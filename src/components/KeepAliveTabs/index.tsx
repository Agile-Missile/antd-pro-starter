import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { theme } from 'antd';
import { useResizeObserver } from 'usehooks-ts';
import { CloseOutlined } from '@ant-design/icons';
import { history, useLocation } from '@umijs/max';
import type { LocalRoute } from './store';
import {
  findRoute,
  getMenuFromSession,
  removeMenuToSession,
  saveMenuToSession,
} from './store';
import './index.less';

export default function KeepAliveTabs({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = theme.useToken();
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.pathname);
  const [tabs, setTabs] = useState<LocalRoute[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const { width = 0 } = useResizeObserver({
    ref: ref as RefObject<HTMLElement>,
    box: 'border-box',
  });

  useEffect(() => {
    const menus = getMenuFromSession();
    setTabs(menus);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    if (location.pathname === '/') return;
    const existingTab = tabs.find((tab) => tab.path === location.pathname);

    if (!existingTab) {
      const currentRoute = findRoute();
      if (currentRoute) {
        setTabs((prevTabs) => {
          const newTabs = [...prevTabs, currentRoute];
          saveMenuToSession(currentRoute);
          return newTabs;
        });
      }
    }

    setActiveKey(location.pathname);
  }, [location.pathname, isInitialized]);

  const removeTab = useCallback(
    (targetKey: string, e?: React.MouseEvent) => {
      e?.stopPropagation();

      setTabs((prevTabs) => {
        const newTabs = prevTabs.filter((tab) => tab.key !== targetKey);

        removeMenuToSession(newTabs);

        if (targetKey === activeKey && newTabs.length > 0) {
          const lastTabKey = newTabs[newTabs.length - 1]?.key;
          history.replace(lastTabKey);
        }

        return newTabs;
      });
    },
    [activeKey]
  );

  const handleTabClick = useCallback(
    (key: string) => {
      if (key === activeKey) return;
      setActiveKey(key);
      history.push(key);
    },
    [activeKey]
  );

  const isActive = useCallback(
    (key: string) => {
      return key === activeKey;
    },
    [activeKey]
  );

  const hiddenCloseIcon = useCallback(() => {
    return tabs.length <= 1;
  }, [tabs]);

  return (
    <div className={'keep-alive-tabs'} ref={ref}>
      <div
        className="tabs-header"
        style={{
          width: width,
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className="tab-item"
            style={{
              ...(isActive(tab.key)
                ? {
                    color: token.colorPrimary,
                    borderBottom: `2px solid ${token.colorPrimary}`,
                  }
                : {}),
            }}
            onClick={() => handleTabClick(tab.key)}
          >
            <span>{tab.name}</span>
            {!hiddenCloseIcon() && (
              <CloseOutlined
                className="close-icon"
                onClick={(e) => removeTab(tab.key, e)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="tabs-content">{children}</div>
    </div>
  );
}
