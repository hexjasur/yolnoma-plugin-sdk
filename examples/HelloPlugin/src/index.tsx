import { definePlugin } from '@yolnoma/plugin-sdk';
import { HelloPage } from './pages/HelloPage.tsx';

export default definePlugin({
  id: 'com.jksoftware.hello',
  name: 'Hello Plugin',
  version: '0.1.0',
  description: 'My first Yolnoma plugin',
  author: {
    name: 'Jasur',
  },

  activate(api) {
    api.router.addRoute({
      path: '/',
      component: HelloPage,
      meta: {
        title: 'Hello Plugin',
      },
    });

    api.navigation.addItem({
      label: 'Hello Plugin',
      path: '/',
    });
  },
});