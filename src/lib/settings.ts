export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/admin/committed": ["admin"],
  "/admin/proposed": ["admin"],
  "/producer(.*)": ["producer"],
  "/staff(.*)": ["staff"],
  "/list/users": ["admin", "producer"],
  "/list/volumes": ["admin", "producer", "staff"],
  "/list/reports": ["admin", "producer", "staff"],
  "/list/reports/sales": ["admin", "producer", "staff"],
  "/list/reports/production": ["admin", "producer", "staff"],
  "/list/forms": ["admin", "producer"],
  "/list/activityLog": ["admin"],
};
