<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { SeatingBasicModel } from '#/models';
import { FormField, TextInput } from '#/components/form';
import SeatingListItem from './SeatingListItem.vue';
import { SearchIcon, XIcon } from '@lucide/vue';

// Dependencies.
const router = useRouter();

// Props.
const props = defineProps<{ model: SeatingBasicModel[] }>();

// States.
const searchContent = ref<string>('');

</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <span class="panel-header-title">
        Danh sách bàn ăn
      </span>
    </div>

    <div class="panel-body flex flex-col">
      <div class="border-b border-black/10 p-3">
        <div class="panel-body-area flex flex-col gap-3 p-3 pt-2">
          <FormField path="searchContent">
            <div class="form-input-group group">
              <span class="form-input-group-text px-2">
                <SearchIcon class="size-4.5 opacity-50" />
              </span>

              <TextInput
                :class="['z-0', searchContent && 'not-focus:border-e-transparent']"
                v-model="searchContent"
              />

              <button
                v-if="searchContent"
                type="button"
                class="btn btn-danger-outline group-has-[input:focus]:border-s-transparent"
                @click="searchContent = ''"
              >
                <XIcon />
              </button>
            </div>
          </FormField>
        </div>
      </div>

      <div class="grid xl:grid-cols-5 lg:grid-cols-4 items-start gap-3 p-3">
        <SeatingListItem
          v-for="seating in model"
          :key="seating.id"
          :model="seating"
          @click="router.push({ name: 'orderUpsert', params: { id: seating.id } })"
        />
      </div>
    </div>
  </div>
</template>
