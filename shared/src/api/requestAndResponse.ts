export type JsonValue = number | string | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type ApiActionArgs<
    TParams extends object | undefined = undefined,
    TQuery extends object | undefined = undefined,
    TJson = JsonValue> = {
  params: TParams;
  query: TQuery;
  json: TJson;
};

export type ApiActionJsonArgs<TJson extends JsonValue> = ApiActionArgs<undefined, undefined, TJson>;
export type ApiActionParamsArgs<TParams extends object> = ApiActionArgs<TParams>;
export type ApiActionIdParamArgs<TId extends string | number> = ApiActionArgs<{ id: TId }>;
export type ApiActionQueryArgs<TQuery extends object | undefined> = ApiActionArgs<undefined, TQuery>;
export type ApiActionEmptyArgs = ApiActionArgs<undefined, undefined, undefined>;

export type JsonResponse<TResponseDto extends JsonValue> = Omit<Response, "json"> & {
  json(): Promise<TResponseDto>;
};

export type EmptyResponse = Omit<Response, "json">;
