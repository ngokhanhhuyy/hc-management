<script lang="ts">
  import NavigationMenuItem from "./NavigationMenuItem.svelte";
  import { LayoutGridIcon, ShoppingCartPlusIcon, Dice4Icon, SoupIcon, TagIcon } from "@lucide/svelte";
</script>

<nav class="flex flex-col gap-10 sticky top-[calc(var(--topbar-height)+(--spacing(3)))] h-fit">
  <div class="flex flex-col">
    <span class="text-sm font-bold opacity-50">Vận hành</span>
    <ul class="list-group list-group-flush">
      <NavigationMenuItem displayName="Danh sách bàn ăn" routeName="SeatingList">
        {#snippet children(className)}
          <LayoutGridIcon class={className} />
        {/snippet}
      </NavigationMenuItem>
      
      <NavigationMenuItem displayName="Gọi món" routeName="OrderUpsert">
        {#snippet children(className)}
          <ShoppingCartPlusIcon class={className} />
        {/snippet}
      </NavigationMenuItem>
    </ul>
  </div>

  <div class="flex flex-col">
    <span class="text-sm font-bold opacity-50">Vận hành</span>
    <ul class="list-group list-group-flush">
      <NavigationMenuItem displayName="Chỉnh sửa bàn ăn" routeName="SeatingEditor">
        {#snippet children(className)}
          <Dice4Icon class={className} />
        {/snippet}
      </NavigationMenuItem>
      
      <NavigationMenuItem displayName="Chỉnh sửa món ăn" routeName="MenuItemEditor">
        {#snippet children(className)}
          <SoupIcon class={className} />
        {/snippet}
      </NavigationMenuItem>
      
      <NavigationMenuItem displayName="Chỉnh sửa phân loại" routeName="MenuCategoryEditor">
        {#snippet children(className)}
          <TagIcon class={className} />
        {/snippet}
      </NavigationMenuItem>
    </ul>
  </div>
</nav>
