import React, { useState, useRef, useEffect } from "react";
import { useLocation, useMatches, Outlet } from "react-router";
import {
  compute,
  getSignInRoutePath,
  getSeatingListRoutePath,
  getSeatingOrderUpsertRoutePath,
  getDashboardRoutePath,
  getHomeRoutePath
} from "#/helpers";

// Child components.
import NavigationMenuItem, { type NavigationBarItemData } from "./NavigationMenuItem";
import {
  SquaresPlusIcon as SeatingListOutlineIcon,
  ClipboardDocumentIcon as OrderUpsertOutlineIcon,
  PencilSquareIcon as PencilSquareOutlineIcon,
} from "@heroicons/react/24/outline";
import {
  SquaresPlusIcon as SeatingListSolidIcon,
  ClipboardDocumentIcon as OrderUpsertSolidIcon,
  PencilSquareIcon as PencilSquareSolidIcon
} from "@heroicons/react/24/solid";

// Components.
export default function NavigationMenu(): React.ReactNode {
  // Dependencies.
  const location = useLocation();

  // States.
  const [activeItemName, setActiveItemName] = useState<string | null>(null);

  // Effect.
  useEffect(() => {
    for (const item of navigationBarOperationItems) {
      if (location.pathname.startsWith(getSeatingListRoutePath())) {
        if (location.pathname.endsWith(getSeatingListRoutePath()) && item.name === "seatingList") {
          setActiveItemName("seatingList");
          return;
        }

        setActiveItemName("orderUpsert");
        return;
      }

      if (location.pathname.startsWith(item.routePath)) {
        setActiveItemName(item.name);
      }
    }
  }, [location.pathname]);

  // Templates.
  return (
    <nav className="flex flex-col gap-10">
      <div className="flex flex-col">
        <span className="text-sm font-bold opacity-50">Vận hành</span>
        <ul className="list-group list-group-flush">
          {navigationBarOperationItems.map((item, index) => (
            <NavigationMenuItem
              name={item.name}
              displayName={item.displayName}
              routePath={item.routePath}
              Icon={item.Icon}
              isActive={activeItemName === item.name}
              isDisabled={item.isDisabled}
              key={index}
            />
          ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-bold opacity-50">Chỉnh sửa</span>
        <ul className="list-group list-group-flush">
          {navigationBarUpsertItems.map((item, index) => (
            <NavigationMenuItem
              name={item.name}
              displayName={item.displayName}
              routePath={item.routePath}
              Icon={item.Icon}
              isActive={activeItemName === item.name}
              isDisabled={item.isDisabled}
              key={index}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

const navigationBarOperationItems: NavigationBarItemData[] = [
  {
    name: "seatingList",
    displayName: "Danh sách bàn ăn",
    routePath: getSeatingListRoutePath(),
    Icon: ({ isActive, className, title }) => {
      const Component = isActive ? SeatingListSolidIcon : SeatingListOutlineIcon;
      return <Component className={className} title={title} />;
    }
  },
  {
    name: "orderUpsert",
    displayName: "Gọi món",
    routePath: getSeatingListRoutePath(),
    isDisabled: true,
    Icon: ({ isActive, className, title }) => {
      const Component = isActive ? OrderUpsertSolidIcon : OrderUpsertOutlineIcon;
      return <Component className={className} title={title} />;
    }
  },
];

const navigationBarUpsertItems: NavigationBarItemData[] = [
  {
    name: "seatingUpsert",
    displayName: "Chỉnh sửa bàn ăn",
    routePath: getHomeRoutePath(),
    Icon: ({ isActive, className, title }) => {
      const Component = isActive ? PencilSquareSolidIcon : PencilSquareOutlineIcon;
      return <Component className={className} title={title} />;
    }
  },
  {
    name: "menuItemUpsert",
    displayName: "Chỉnh sửa món ăn",
    routePath: getHomeRoutePath(),
    Icon: ({ isActive, className, title }) => {
      const Component = isActive ? PencilSquareSolidIcon : PencilSquareOutlineIcon;
      return <Component className={className} title={title} />;
    }
  },
  {
    name: "menuItemUpsert",
    displayName: "Chỉnh sửa phân loại",
    routePath: getHomeRoutePath(),
    Icon: ({ isActive, className, title }) => {
      const Component = isActive ? PencilSquareSolidIcon : PencilSquareOutlineIcon;
      return <Component className={className} title={title} />;
    }
  },
];
