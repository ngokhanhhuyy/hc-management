import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router';
import { useAuthenticationStore } from '#/stores';

import RootLayout from '#/components/layouts/RootLayout.vue';
import MainPageLayout from '#/components/layouts/MainPageLayout.vue';
import SignInPage from '#/pages/authentication/SignInPage.vue';
import SeatingListPage from '#/pages/dashboard/seatingList/SeatingListPage.vue';
import OrderUpsertPage from '#/pages/dashboard/orderUpsert/OrderUpsertPage.vue';
import BlankPage from '#/pages/BlankPage.vue';

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    component: RootLayout,
    children: [
      {
        path: '',
        component: MainPageLayout,
        children: [
          {
            path: '',
            name: 'seatingList',
            component: SeatingListPage
          },
          {
            path: ':id(\\d+)',
            name: 'orderUpsert',
            component: OrderUpsertPage
          },
          {
            path: 'chinh-sua',
            name: 'editor',
            component: BlankPage,
            children: [
              {
                path: 'ban-an',
                name: 'seatingEditor',
                component: BlankPage,
                children: [
                  {
                    path: 'tao-moi',
                    name: 'seatingEditorCreate',
                    component: BlankPage
                  },
                  {
                    path: ':id(\\d+)',
                    name: 'seatingEditorUpdate',
                    component: BlankPage
                  }
                ]
              },
              {
                path: 'mon-an',
                name: 'menuItemEditor',
                component: BlankPage,
                children: [
                  {
                    path: 'tao-moi',
                    name: 'menuItemEditorCreate',
                    component: BlankPage
                  },
                  {
                    path: ':id(\\d+)',
                    name: 'menuItemEditorUpdate',
                    component: BlankPage
                  }
                ]
              },
              {
                path: 'phan-loai',
                name: 'menuCategoryEditor',
                component: BlankPage,
                children: [
                  {
                    path: 'tao-moi',
                    name: 'menuCategoryEditorCreate',
                    component: BlankPage
                  },
                  {
                    path: ':id(\\d+)',
                    name: 'menuCategoryEditorUpdate',
                    component: BlankPage
                  }
                ]
              }
            ]
          },
          {
            path: 'bao-cao',
            name: 'report',
            component: BlankPage
          },
        ]
      },
      {
        path: 'dang-nhap',
        name: 'signIn',
        component: SignInPage,
      }
    ],
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const authenticationStore = useAuthenticationStore();
  if (to.name === 'signIn' && authenticationStore.isAuthenticated) {
    return { name: 'seatingList' };
  }

  if (to.name !== 'signIn' && !authenticationStore.isAuthenticated) {
    return { name: 'signIn' };
  }
});
