# ken-burns-carousel
[![Travis](https://travis-ci.org/Festify/ken-burns-carousel.svg?branch=master)](https://travis-ci.org/Festify/ken-burns-carousel)

A bare and extremely light web component that displays a set of images with a ken burns effect.

## Usage
```html
<!-- Set images to display via attribute (property is also supported) -->
<ken-burns-carousel images="https://source.unsplash.com/Qh9Swf_8DyA https://source.unsplash.com/O453M2Liufs">
</ken-burns-carousel>
```

And the carousel will begin ✨.

## Performance
The element preloads images before displaying them so that FOUCs can be prevented. This also works across different image lists.

## License
MIT