import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';

const buildAt = () => {
    var d = new Date();
    //return `Build ${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()} at ${d.getHours()}:${d.getMinutes()}`;
    return `Build: ${d.getFullYear().toString().substring(3)}.${d.getMonth() + 1}${d.getDate()} (${d.getHours()}${d.getMinutes()})`;
};

export default defineConfig({
    base: '',
    plugins: [
        react(),

        { ...url({ include: ['**/*.svg'], limit: 15000, }), enforce: 'pre', },

        // replace({
        //     values: {
        //         __BUILD_DATE__: buildAt(),
        //     },
        //     preventAssignment: true,
        // }),

        visualizer({
            filename: 'visualization.html',
            template: 'sunburst', // sunburst - d3 style (good as default as well); treemap - table (default); network - graph (slow to open).
            gzipSize: true,
            brotliSize: true,
        }),
    ]
});
