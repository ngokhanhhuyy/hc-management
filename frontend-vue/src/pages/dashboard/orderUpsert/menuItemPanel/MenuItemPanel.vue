<script setup lang="ts">
import { ref, reactive, computed, watch, type Reactive, type ClassValue } from 'vue';
import { api, displayNames, type MenuItemListResponseDto } from '#/api';
import {
  MenuCategoryBasicModel,
  MenuItemListModel,
  type MenuItemBasicModel,
  type OrderItemUpsertModel
} from '#/models';
import { Form, FormField, TextInput } from '#/components/form';
import MenuItem from './MenuItem.vue';
import MenuCategory from './MenuCategory.vue';
import { Paginator } from '#/components/ui';
import { XIcon, SearchIcon } from '@lucide/vue';

// Props and emits.
export type MenuItemWithPickedQuantity = {
  item: MenuItemBasicModel;
  quantity: number;
};

const props = defineProps<{
  pickedOrderItems: OrderItemUpsertModel[];
  disabled: boolean;
}>();

const emit = defineEmits<{
  picked: [pickedMenuItem: MenuItemBasicModel];
}>();

// States.
const [itemListModel, categoryModels] = await initialLoadAsync();
const loadingState = ref<'initialLoading' | 'reloading' | null>('initialLoading');
let lastRequestId: number = 0;

// Computed.
const menuItemGridClassName = computed<ClassValue>(() => ([
  'menu-item-grid grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2',
  'w-full transition-opacity',
  loadingState.value === 'reloading' && 'opacity-50'
]));

// Callbacks.
async function initialLoadAsync(): Promise<[Reactive<MenuItemListModel>, MenuCategoryBasicModel[]]> {
  const menuItemListModel = new MenuItemListModel();
  const [ menuCategoryListResponseDtos, menuItemListResponseDto] = await Promise.all([
    api.menuCategory.getAllAsync(),
    api.menuItem.getListAsync(menuItemListModel.toRequestDto())
  ]);

  menuItemListModel.mapFromResponseDto(menuItemListResponseDto);

  return [reactive(menuItemListModel), menuCategoryListResponseDtos.map(dto => new MenuCategoryBasicModel(dto))];
}

async function reloadAsync(): Promise<void> {
  if (loadingState.value === 'initialLoading') {
    loadingState.value = null;
    return;
  }

  const requestId = lastRequestId += 1;
  loadingState.value = 'reloading';
  const responseDto = await api.menuItem.getListAsync(itemListModel.toRequestDto());
  if (lastRequestId === requestId) {
    itemListModel.mapFromResponseDto(responseDto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadingState.value = null;
  }
}

async function submitAsync(): Promise<MenuItemListResponseDto> {
  return await api.menuItem.getListAsync(itemListModel.toRequestDto());
}

function onSubmissionSucceeded(responseDto: MenuItemListResponseDto): void {
  itemListModel.mapFromResponseDto(responseDto);
}

// Wacher.
watch(() => itemListModel.page, reloadAsync);
watch([itemListModel.pageCount, itemListModel.searchContent, itemListModel.category?.id], async () => {
  itemListModel.page = 1;
  await reloadAsync();
});
</script>

<template>
  <div v-if="loadingState === 'initialLoading'" class="flex flex-col justify-center items-center h-full gap-3">
    <span class="text-primary opacity-50">
      Đang tải
    </span>
  </div>

  <div :class="['flex flex-col gap-3 h-full', props.disabled && 'opacity-50 pointer-events-none']">
    <div class="panel">
      <div class="panel-header">
        <span class="panel-header-title">
          Danh sách món ăn
        </span>
      </div>

      <div class="panel-body flex flex-col">
        <Form class="form" :action="submitAsync" @succeeded="onSubmissionSucceeded">
          <FormField path="searchContent" :display-name="displayNames['searchContent']" hide-label>
            <div class="form-input-group">
              <div class="form-input-group-text px-2">
                <SearchIcon class="size-4.5" />
              </div>

              <TextInput
                v-model="itemListModel.searchContent"
                class="['z-0', itemListModel.searchContent && 'rounded-e-none']"
                placeholder="Tìm kiếm tên món ăn ..."
              />

              <template v-if="itemListModel.searchContent">
                <button type="button" class="btn border-s-0" @click="itemListModel.searchContent = ''">
                  <XIcon />
                </button>
              </template>
            </div>
          </FormField>

          <FormField path="categoryId" :display-name="displayNames.category" hide-label>
            <div class="flex flex-row flex-wrap justify-start items-start gap-2">
              <MenuCategory
                :model="null"
                :is-selected="itemListModel.category?.id == null"
                @selected="itemListModel.category = null"
              />

              <MenuCategory
                v-for="category in categoryModels"
                :key="category.id"
                :model="category"
                :is-selected="itemListModel.category?.id === category.id"
                @selected="itemListModel.category = category"
              />
            </div>
          </FormField>
        </Form>

        <div class="flex flex-col justify-center items-center gap-3 p-3 border-t border-black/15">
          <div v-if="itemListModel.items.length" :class="menuItemGridClassName">
            <MenuItem
              v-for="menuItem in itemListModel.items"
              :key="menuItem.id"
              :model="menuItem"
              :picked-order-items
              @click="emit('picked', menuItem)"
            />
          </div>
          
          <div v-else class="opacity-30 py-10">
            Không tìm thấy kết quả
          </div>
        </div>
      </div>

      <div v-if="itemListModel.pageCount > 1" class="panel-footer">
        <Paginator
          :page="itemListModel.page"
          :pageCount="itemListModel.pageCount"
          :page-button-class="(_: number, isActive: boolean) => isActive ? 'btn btn-primary' : 'btn'"
          @page-changed="(page: number) => itemListModel.page = page"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '#/assets/css/style.css';

.form {
  background-color: --alpha(var(--color-black) / 5%);
  border: 1px solid --alpha(var(--color-black) / 10%);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: --spacing(3);
  margin: --spacing(3);
  padding: --spacing(3);
}

.menu-item-grid {
  gap: --spacing(3);
  justify-content: start;
  align-items: start;
  width: 100%;
  transition: opacity .2s;
}
</style>
