/**
 * All available ken burns CSS animations.
 */
export const animationNames = [
    'ken-burns-bottom-right',
    'ken-burns-top-left',
    'ken-burns-bottom-left',
    'ken-burns-top-right',
    'ken-burns-middle-left',
    'ken-burns-middle-right',
    'ken-burns-top-middle',
    'ken-burns-bottom-middle',
    'ken-burns-center',
];
const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        overflow: hidden;
        position: relative;
    }

    div, img {
        height: 100%;
        width: 100%;
    }

    div {
        position: absolute;
        will-change: transform;
    }

    img {
        filter: var(--img-filter);
        object-fit: cover;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes ken-burns-bottom-right {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(-10%, -7%, 0);
        }
    }
    @keyframes ken-burns-top-right {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(-10%, 7%, 0);
        }
    }
    @keyframes ken-burns-top-left {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(10%, 7%, 0);
        }
    }
    @keyframes ken-burns-bottom-left {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(10%, -7%, 0);
        }
    }
    @keyframes ken-burns-middle-left {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(10%, 0, 0);
        }
    }
    @keyframes ken-burns-middle-right {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(-10%, 0, 0);
        }
    }
    @keyframes ken-burns-top-middle {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(0, 10%, 0);
        }
    }
    @keyframes ken-burns-bottom-middle {
        to {
            transform: scale3d(1.5, 1.5, 1.5) translate3d(0, -10%, 0);
        }
    }
    @keyframes ken-burns-center {
        to {
            transform: scale3d(1.5, 1.5, 1.5);
        }
    }
</style>
`;
if (typeof window.ShadyCSS === 'object') {
    window.ShadyCSS.prepareTemplate(template, 'ken-burns-carousel');
}
/**
 * `ken-burns-carousel`
 *
 * Displays a set of images in a smoothly-fading ken burns style carousel.
 *
 * @demo ../demo/index.html
 */
export default class KenBurnsCarousel extends HTMLElement {
    constructor() {
        super();
        /**
         * Specifies the list of ken burns animations to apply to the elements.
         *
         * This allows customizing the built-in animations to your liking by overriding
         * the ones you don't like with custom CSS animations.
         *
         * This can also be set via setting the `animation-names`-attribute to a space-
         * separated list of CSS animation names.
         *
         * @type String[]
         */
        this.animationNames = animationNames;
        /**
         * The direction to play the animations in.
         *
         * Defaults to Direction.Random, meaning that with each image the associated ken
         * burns animation is either played forwards or backwards adding additional visual
         * diversity.
         *
         * This can also be set via the `animation-direction`-attribute.
         *
         * @type Direction
         */
        this.animationDirection = "random" /* Random */;
        this._fadeDuration = 2500;
        this._imgList = [];
        this._slideDuration = 20000;
        this._timeout = 0;
        this._zCounter = 0;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    static get observedAttributes() {
        return [
            "animation-direction" /* AnimationDirection */,
            "animation-names" /* AnimationNames */,
            "fade-duration" /* FadeDuration */,
            "images" /* Images */,
            "slide-duration" /* SlideDuration */,
        ];
    }
    /**
     * The duration of the crossfading animation in millseconds.
     *
     * Must be smaller than the slide duration. Defaults to 2500ms.
     * This can also be set via the `fade-duration`-attribute.
     *
     * @type number
     */
    get fadeDuration() {
        return this._fadeDuration;
    }
    set fadeDuration(val) {
        if (val > this.slideDuration) {
            throw new RangeError("Fade duration must be smaller than slide duration");
        }
        this._fadeDuration = val;
    }
    /**
     * The list of URLs to the images to display.
     *
     * You can either set this property directly, or set the `images`-attribute
     * to a space-separated list of URLs.
     *
     * The element will dirty-check this property to avoid switching to the next image
     * even if the images set were the same. If you forcefully want to rerender, ensure
     * you pass a different array because the dirty-check will check for identity.
     *
     * @type string[]
     */
    get images() {
        return this._imgList;
    }
    set images(images) {
        if (arraysEqual(this._imgList, images)) {
            return;
        }
        this._imgList = images;
        if (images.length > 0) {
            this.animateImages(images);
        }
        else {
            this.stop();
        }
    }
    /**
     * The duration of the sliding (or ken burns) animation in millseconds.
     *
     * Must be greater than or equal to the fade duration. Defaults to 20s.
     * This can also be set via the `slide-duration`-attribute.
     *
     * @type number
     */
    get slideDuration() {
        return this._slideDuration;
    }
    set slideDuration(val) {
        if (val < this.fadeDuration) {
            throw new RangeError("Slide duration must be greater than fade duration");
        }
        this._slideDuration = val;
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "animation-direction" /* AnimationDirection */:
                this.animationDirection = newVal;
                break;
            case "animation-names" /* AnimationNames */:
                this.animationNames = newVal
                    ? newVal.split(' ').filter(name => name)
                    : animationNames;
                break;
            case "fade-duration" /* FadeDuration */:
                this.fadeDuration = Number(newVal);
                break;
            case "images" /* Images */:
                this.images = newVal
                    ? newVal.split(' ').filter(url => url)
                    : [];
                break;
            case "slide-duration" /* SlideDuration */:
                this.slideDuration = Number(newVal);
                break;
        }
    }
    connectedCallback() {
        if (typeof window.ShadyCSS === 'object') {
            window.ShadyCSS.styleElement(this);
        }
    }
    animateImages(images) {
        const insert = (index, img) => {
            const random = Math.random();
            const animationIndex = Math.floor(random * this.animationNames.length);
            const direction = this.animationDirection === "random" /* Random */
                ? random > .5 ? 'normal' : 'reverse'
                : this.animationDirection;
            /*
             * Here we wrap the image element into a surrounding div that is promoted
             * onto a separate GPU layer using `will-change: transform`. The wrapping div
             * is then ken-burns-animated instead of the image itself.
             *
             * This leads the browser to pre-computing the image filter (--img-filter)
             * instead of computing it every frame. This can be a massive performance boost
             * if the filter is expensive.
             *
             * See https://developers.google.com/web/updates/2017/10/animated-blur for
             * more information.
             */
            const wrap = document.createElement('div');
            wrap.appendChild(img);
            wrap.style.animationName = `${this.animationNames[animationIndex]}, fade-in`;
            wrap.style.animationDuration = `${this.slideDuration}ms, ${this.fadeDuration}ms`;
            wrap.style.animationDirection = `${direction}, normal`;
            wrap.style.animationTimingFunction = 'linear, ease';
            wrap.style.zIndex = String(this._zCounter++);
            this.shadowRoot.appendChild(wrap);
            setTimeout(() => wrap.remove(), this.slideDuration);
            // Preload next image and place it in browser cache
            const nextIndex = (index + 1) % images.length;
            const next = document.createElement('img');
            next.src = images[nextIndex];
            this._timeout = setTimeout(() => insert(nextIndex, next), this.slideDuration - this.fadeDuration);
        };
        const img = document.createElement('img');
        img.src = images[0];
        img.onload = () => {
            /*
             * Prevent race condition leading to wrong list being displayed.
             *
             * The problem arose when you were switching out the image list before
             * this callback had fired. The callback of a later list could have fired
             * faster than the one of earlier lists, which lead to the later slideshow
             * (the right one) being cancelled when the previous one became available.
             *
             * We now check whether we're still displaying the list we started
             * with and only then proceed with actually stopping the old slideshow
             * and displaying it.
             */
            if (!arraysEqual(this._imgList, images)) {
                return;
            }
            this.stop();
            insert(0, img);
        };
    }
    stop() {
        clearTimeout(this._timeout);
        this._timeout = 0;
    }
}
function arraysEqual(arr1, arr2) {
    // tslint:disable-next-line:triple-equals
    if (arr1 === arr2 || (!arr1 && !arr2)) {
        return true;
    }
    if (!arr1 || !arr2 || arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=element.js.map