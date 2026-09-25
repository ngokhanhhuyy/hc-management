import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLoaderData } from "react-router";

// Child components.
import type { OrderPageDataLoadedResult } from "./dataLoader";

// Components.
export function OrderPageLayout() {
  // Dependencies.
  const initialModel = useLoaderData<OrderPageDataLoadedResult>();

  // 
}
