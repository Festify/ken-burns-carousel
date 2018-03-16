import minify from 'rollup-plugin-babel-minify';
import cjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/ken-burns-carousel.ts',
    output: {
        file: 'dist/ken-burns-carousel.min.js',
        format: 'umd',
        name: 'KenBurnsCarousel',
        sourcemap: true,
    },
    plugins: [
        nodeResolve({ browser: true }),
        typescript(),
        cjs(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'develop'),
        }),
        minify({ comments: false }),
    ],
};