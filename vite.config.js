import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        auth: resolve(__dirname, 'auth.html'),
        superAdmin: resolve(__dirname, 'super-admin.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        seller: resolve(__dirname, 'seller/index.html'),
        marketplace: resolve(__dirname, 'marketplace/index.html'),
        product: resolve(__dirname, 'product/index.html'),
        login: resolve(__dirname, 'login/index.html'),
        register: resolve(__dirname, 'register/index.html'),
        suspended: resolve(__dirname, 'suspended.html'),
      },
    },
  },
});
