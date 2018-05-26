# \<ken-burns-carousel\>
[![Travis](https://travis-ci.org/Festify/ken-burns-carousel.svg?branch=master)](https://travis-ci.org/Festify/ken-burns-carousel)

A bare and extremely light web component that displays a set of images with a ken burns effect. [Demo](https://festify.github.io/ken-burns-carousel/).

<p align="center">
  <a href="https://festify.github.io/ken-burns-carousel/">
    <img src="https://user-images.githubusercontent.com/1683034/37485135-e91fc698-288a-11e8-973b-999f86d3fd97.gif">
  </a>
</p>

## Usage
```html
<!-- Set images to display via attribute (property is also supported) -->
<ken-burns-carousel images="https://source.unsplash.com/Qh9Swf_8DyA https://source.unsplash.com/O453M2Liufs">
</ken-burns-carousel>
```

And the carousel will begin fading images ✨. See the [Demo](https://festify.github.io/ken-burns-carousel/) for more examples.

## Compatibility
The element works in all evergreen browsers (tested on Firefox, Chrome, Safari and Edge). Mileage with other browsers may vary.

That said, the element does not do any complex DOM operations or use any fancy APIs (except for web components, of course), so adapting it, if needed, will be simple. The element has been adapted for usage with the ShadyDOM polyfill.

## Performance
The element makes careful use of composition layers and uses CSS 3D transforms and opacity animations exclusively. As such, animations will run butter smooth even when expensive filters are applied to the images.

The element also preloads images before displaying them so that FOUCs are prevented. This also works across different image lists. For optimal results, ensure the element has a nice background color as the element is transparent while the first image is loading.

## License
MIT
