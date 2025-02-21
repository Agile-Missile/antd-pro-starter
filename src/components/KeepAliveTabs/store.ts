import { treeToArray } from '@dimjs/utils';
import type { Route } from '@umijs/route-utils/dist/types';
import routes from '../../../config/routes';

const SESSION_MENUS_KEY = 'menus';

export type LocalRoute = Omit<Route, 'name' | 'key'> & {
  key: string;
  name: string;
};

export const findRoute = (): LocalRoute => {
  const routeArr = treeToArray<any, 'routes'>(routes, 'routes');
  const route = routeArr
    .filter((route) => Boolean(route.path))
    .find((route) => route.path === location.pathname);
  return {
    ...route,
    key: route?.path,
    name: route?.name || document.title || location.pathname,
  };
};

export const saveMenuToSession = (menu: LocalRoute) => {
  const earlyMenus = getMenuFromSession();
  if (earlyMenus.find((m) => m.key === menu.key)) {
    return;
  }
  sessionStorage.setItem(
    SESSION_MENUS_KEY,
    JSON.stringify([...earlyMenus, menu])
  );
};

export const getMenuFromSession = (): LocalRoute[] => {
  const menu = sessionStorage.getItem(SESSION_MENUS_KEY);
  return menu ? JSON.parse(menu) : [];
};
