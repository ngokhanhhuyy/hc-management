type RouteParamsByName =
  | { name: "SignIn" }
  | { name: "SeatingList" }
  | { name: "OrderUpsert", params: { id: number } }
  | { name: "MenuItemEditor" }
  | { name: "MenuCategoryEditor"}
  | { name: "SeatingEditor" }
  | { name: "Report" };

export type RouteName = RouteParamsByName["name"];

type RouteParams<TName extends RouteName> =
  Extract<RouteParamsByName, { name: TName }> extends { params: infer TParams }
    ? TParams
    : undefined;

class RouterStore {
  private _routeName = $state<RouteName>("SeatingList");
  private _routeParams = $state<object>({ });

  public get routeName(): RouteName {
    return this._routeName;
  }

  public get routeParams(): object {
    return this._routeParams;
  }

  public setRoute<TName extends RouteName>(
    name: TName,
    ...args: RouteParams<TName> extends undefined ? [params?: undefined] : [params: RouteParams<TName>]): void {
    this._routeName = name;
    this._routeParams = args[0] ?? { };
  }
}

export const routerStore = new RouterStore();
