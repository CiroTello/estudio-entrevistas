// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Guía de Estudio Backend',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/CiroTello/study-interview', // Cambialo por tu repo real
        },
      ],
      sidebar: [
        {
          label: 'Fundamentos',
          items: [
            { label: 'SOLID', slug: 'fundamentos/solid' }
          ],
        },
      ],
    }),
  ],
});
