import { Fragment, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { treeToArray } from '@dimjs/utils';
import { history, useLocation } from '@umijs/max';
import routes from '../../../config/routes';
import './index.less';
export default function KeepAliveTabs({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.pathname);
  const [tabs, setTabs] = useState<{ label: string; key: string }[]>([]);

  const findRouteName = () => {
    const routeArr = treeToArray<any, 'routes'>(routes, 'routes');
    const route = routeArr.find((route) => route.path === location.pathname);
    return route?.name;
  };

  // 监听路由变化，动态添加 Tab
  useEffect(() => {
    console.log(location, document.title, findRouteName());
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

  // 关闭 Tab
  const removeTab = (targetKey: string) => {
    const newTabs = tabs.filter((tab) => tab.key !== targetKey);
    setTabs(newTabs);
    if (targetKey === activeKey) {
      history.push(newTabs[newTabs.length - 1]?.key);
    }
  };

  return (
    <div className={'keep-alive-tabs'}>
      {tabs.length > 1 && (
        <Tabs
          size="small"
          type="card"
          activeKey={activeKey}
          onChange={(key) => history.push(key)}
          className="tabs"
          items={tabs.map((tab) => ({
            ...tab,
            children: <Fragment />,
          }))}
        />
      )}
      <div className="tabs-content">{children}</div>
    </div>
  );
}
