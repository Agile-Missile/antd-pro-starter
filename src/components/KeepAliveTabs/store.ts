import { treeToArray } from '@dimjs/utils';
import type { Route } from '@umijs/route-utils/dist/types';
import routes from '../../../config/routes';

const SESSION_MENUS_KEY = 'menus';

export type LocalRoute = Omit<Route, 'name' | 'key'> & {
  key: string;
  name: string;
};

const normalizePath = (path: string = '') =>
  path.replace(/^\/?/, '/').replace(/\/?$/, '/');

export const findRoute = (): LocalRoute | null => {
  try {
    const routeArr = treeToArray<any, 'routes'>(routes, 'routes');
    const route = routeArr
      .filter((route) => Boolean(route.path))
      .find((route) => {
        return normalizePath(route.path) === normalizePath(location.pathname);
      });

    if (!route) {
      return null;
    }

    return {
      ...route,
      key: route?.path,
      name: route?.name || document.title || location.pathname,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const saveMenuToSession = (menu: LocalRoute) => {
  try {
    const earlyMenus = getMenuFromSession();
    if (earlyMenus.find((m) => m.key === menu.key)) {
      return;
    }

    const newMenus = [...earlyMenus, menu];
    sessionStorage.setItem(SESSION_MENUS_KEY, JSON.stringify(newMenus));
  } catch (error) {
    console.error(error);
  }
};

export const removeMenuToSession = (menus: LocalRoute[]) => {
  try {
    sessionStorage.setItem(SESSION_MENUS_KEY, JSON.stringify(menus));
  } catch (error) {
    console.error(error);
  }
};

export const getMenuFromSession = (): LocalRoute[] => {
  try {
    const menu = sessionStorage.getItem(SESSION_MENUS_KEY);
    if (!menu) {
      return [];
    }

    const parsedMenus = JSON.parse(menu);
    return parsedMenus;
  } catch (error) {
    console.error(error);
    sessionStorage.removeItem(SESSION_MENUS_KEY);
    return [];
  }
};

export const clearMenuFromSession = () => {
  sessionStorage.removeItem(SESSION_MENUS_KEY);
};
