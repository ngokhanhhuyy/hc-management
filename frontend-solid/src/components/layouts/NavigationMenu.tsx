import NavigationMenuItem from "./NavigationMenuItem";

export default function NavigationMenu(): JSXElement {
  // Template.
  return (
    <nav class="flex flex-col gap-10 sticky top-[calc(var(--topbar-height)+(--spacing(3)))] h-fit">
      <div class="flex flex-col">
        <span class="text-sm font-bold opacity-50">Vận hành</span>
        <ul class="list-group list-group-flush">
          <NavigationMenuItem routePath="/bang-dieu-khien/ban-an" displayName="Danh sách bàn ăn">
            <i class="bi bi-grid" />
          </NavigationMenuItem>
          
          <NavigationMenuItem routePath="/bang-dieu-khien/goi-mon" displayName="Gọi món" isDisabled>
            <i class="bi bi-cart4" />
          </NavigationMenuItem>
        </ul>
      </div>

      <div class="flex flex-col">
        <span class="text-sm font-bold opacity-50">Vận hành</span>
        <ul class="list-group list-group-flush">
          <NavigationMenuItem routePath="/chinh-sua/ban-an" displayName="Chỉnh sửa bàn ăn">
            <i class="bi bi-dice-4" />
          </NavigationMenuItem>

          <NavigationMenuItem routePath="/chinh-sua/mon-an" displayName="Chỉnh sửa món ăn">
            <i class="bi bi-fork-knife" />
          </NavigationMenuItem>

          <NavigationMenuItem routePath="/chinh-sua/phan-loai" displayName="Chỉnh sửa phân loại">
            <i class="bi bi-tag" />
          </NavigationMenuItem>
        </ul>
      </div>
    </nav>
  );
}
