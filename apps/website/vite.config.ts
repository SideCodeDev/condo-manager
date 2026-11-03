import { defineConfig } from 'vite'
import { createRequire } from 'node:module'
import path from 'node:path'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'

const require = createRequire(import.meta.url)

const config = defineConfig({
  resolve: {
    extensions: [
      '.web.mjs',
      '.mjs',
      '.js',
      '.web.mts',
      '.mts',
      '.web.ts',
      '.ts',
      '.web.jsx',
      '.jsx',
      '.web.tsx',
      '.tsx',
      '.json',
    ],
    tsconfigPaths: true,
    alias: [
      { find: /^react-native$/, replacement: require.resolve('react-native-web') },
      { find: /^lucide-react-native$/, replacement: require.resolve('lucide-react') },
      {
        find: /^react-native-reanimated$/,
        replacement: path.resolve(
          import.meta.dirname,
          '../../packages/ui/src/lib/reanimated-web.ts',
        ),
      },
      {
        find: /^expo-document-picker$/,
        replacement: path.resolve(
          import.meta.dirname,
          '../../packages/ui/src/lib/expo-document-picker.web.ts',
        ),
      },
    ],
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
