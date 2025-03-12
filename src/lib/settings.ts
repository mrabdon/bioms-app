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
  "/list/users": ["admin", "producer", "staff"],
  "/list/users/producer": ["admin", "producer", "staff"],
  "/list/users/staff": ["admin", "producer", "staff"],
  "/list/volumes": ["admin", "producer", "staff"],
  "/list/volumes/sold": ["admin", "producer", "staff"],
  "/list/volumes/produce": ["admin", "producer", "staff"],
  "/list/volumes/lift": ["admin", "producer", "staff"],
  "/list/reports": ["admin", "producer", "staff"],
  "/list/reports/sales": ["admin", "producer", "staff"],
  "/list/reports/production": ["admin", "producer", "staff"],
  "/list/forms": ["admin", "producer"],
  "/list/activityLog": ["admin"],
  "/api/webhooks(.*)": [],
  // "/": ["admin", "producer", "staff"],
  // "/reset-password": ["admin", "producer", "staff"],
  // "/sign-in": ["admin", "producer", "staff"],
  // "/sign-up": ["admin", "producer", "staff"],
};
