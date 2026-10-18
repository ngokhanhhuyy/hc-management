<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { SignInModel } from '#/models';
import { useAuthenticationStore } from '#/stores';
import { Form, FormField, TextInput } from '#/components/form';
import logoUrl from '#/assets/images/logo.png';

// Dependencies.
const router = useRouter();
const authenticationStore = useAuthenticationStore();

// States.
const model = ref(new SignInModel());
const isAuthenticated = ref<boolean>(false);

// Callbacks.
async function submitAsync(): Promise<void> {
  try {
    await authenticationStore.signInAsync(model.value);
  } finally {
    model.value.password = '';
  }
}

async function handleSubmissionSucceededAsync(): Promise<void> {
  isAuthenticated.value = true;
  router.push({ name: 'seatingList' });
}
</script>

<template>
  <div class="flex justify-center items-center w-full h-screen self-center">
    <Form
      :action="submitAsync"
      @submission-succeeded="handleSubmissionSucceededAsync"
      class="panel"
      submit-on-enter-key-pressed
    >
      <div v-if="!isAuthenticated" class="panel-body flex flex-col p-3 gap-3 min-w-75">
        <img :src="logoUrl" class="img-thumbnail aspect-square shadow-xs" alt="HCManagement" />

        <FormField path="userName">
          <TextInput v-model="model.userName" />
        </FormField>

        <FormField path="password">
          <TextInput type="password" v-model="model.password" />
        </FormField>

        <button type="submit" class="btn bg-black text-white mt-3">
          Đăng nhập
        </button>
      </div>

      <div v-else class="bg-emerald-600/5 border border-emerald-600 p-3 rounded-lg flex justify-center text-bold">
        Đăng nhập thành công
      </div>
    </Form>
  </div>
</template>

<style scoped>
.panel {
  max-width: 350px;
}
</style>
