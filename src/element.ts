/**
 * Specifies the direction of the ken burns effect.
 */
export const enum Direction {
    Normal = 'normal',
    Reverse = 'reverse',
    Random = 'random',
}

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

const enum Attributes {
    AnimationDirection = 'animation-direction',
    AnimationNames = 'animation-names',
    FadeDuration = 'fade-duration',
    Images = 'images',
    SlideDuration = 'slide-duration',
}

const template = document.createElement('template') as HTMLTemplateElement;
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

if (typeof (window as any).ShadyCSS === 'object') {
    (window as any).ShadyCSS.prepareTemplate(template, 'ken-burns-carousel');
}

/**
 * `ken-burns-carousel`
 *
 * Displays a set of images in a smoothly-fading ken burns style carousel.
 *
 * @demo ../demo/index.html
 */
export default class KenBurnsCarousel extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            Attributes.AnimationDirection,
            Attributes.AnimationNames,
            Attributes.FadeDuration,
            Attributes.Images,
            Attributes.SlideDuration,
        ];
    }

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
    animationNames: string[] = animationNames;

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
    animationDirection: Direction = Direction.Random;

    private _fadeDuration: number = 2500;
    private _imgList: string[] = [];
    private _slideDuration: number = 20000;
    private _timeout: number = 0;
    private _zCounter: number = 0;

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

    set fadeDuration(val: number) {
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
    get images(): string[] {
        return this._imgList;
    }

    set images(images: string[]) {
        if (arraysEqual(this._imgList, images)) {
            return;
        }

        this._imgList = images;
        if (images.length > 0) {
            this.animateImages(images);
        } else {
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

    set slideDuration(val: number) {
        if (val < this.fadeDuration) {
            throw new RangeError("Slide duration must be greater than fade duration");
        }

        this._slideDuration = val;
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.appendChild(template.content.cloneNode(true));
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch (name) {
            case Attributes.AnimationDirection:
                this.animationDirection = newVal as Direction;
                break;
            case Attributes.AnimationNames:
                this.animationNames = newVal
                    ? newVal.split(' ').filter(name => name)
                    : animationNames;
                break;
            case Attributes.FadeDuration:
                this.fadeDuration = Number(newVal);
                break;
            case Attributes.Images:
                this.images = newVal
                    ? newVal.split(' ').filter(url => url)
                    : [];
                break;
            case Attributes.SlideDuration:
                this.slideDuration = Number(newVal);
                break;
        }
    }

    connectedCallback() {
        if (typeof (window as any).ShadyCSS === 'object') {
            (window as any).ShadyCSS.styleElement(this);
        }
    }

    private animateImages(images: string[]) {
        const insert = (index: number, img: HTMLImageElement) => {
            const random = Math.random();
            const animationIndex = Math.floor(random * this.animationNames.length);
            const direction = this.animationDirection === Direction.Random
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

            this.shadowRoot!.appendChild(wrap);
            setTimeout(() => wrap.remove(), this.slideDuration);

            // Preload next image and place it in browser cache
            const nextIndex = (index + 1) % images.length;
            const next = document.createElement('img') as HTMLImageElement;
            next.src = images[nextIndex];

            this._timeout = setTimeout(
                () => insert(nextIndex, next),
                this.slideDuration - this.fadeDuration,
            );
        };

        const img = document.createElement('img') as HTMLImageElement;
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
            if (!arraysEqual(this._imgList, images)) {
                return;
            }

            this.stop();
            insert(0, img);
        };
    }

    private stop() {
        clearTimeout(this._timeout);
        this._timeout = 0;
    }
}

function arraysEqual<T>(arr1: T[] | null, arr2: T[] | null) {
    // tslint:disable-next-line:triple-equals
    if (arr1 === arr2 || (!arr1 && !arr2)) { // undefined == null here
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
