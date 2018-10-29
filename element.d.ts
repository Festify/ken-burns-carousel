/**
 * Specifies the direction of the ken burns effect.
 */
export declare const enum Direction {
    Normal = "normal",
    Reverse = "reverse",
    Random = "random",
}
/**
 * All available ken burns CSS animations.
 */
export declare const animationNames: string[];
/**
 * `ken-burns-carousel`
 *
 * Displays a set of images in a smoothly-fading ken burns style carousel.
 *
 * @demo ../demo/index.html
 */
export default class KenBurnsCarousel extends HTMLElement {
    static readonly observedAttributes: string[];
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
    animationNames: string[];
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
    animationDirection: Direction;
    private _fadeDuration;
    private _imgList;
    private _slideDuration;
    private _timeout;
    private _zCounter;
    /**
     * The duration of the crossfading animation in millseconds.
     *
     * Must be smaller than the slide duration. Defaults to 2500ms.
     * This can also be set via the `fade-duration`-attribute.
     *
     * @type number
     */
    fadeDuration: number;
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
    images: string[];
    /**
     * The duration of the sliding (or ken burns) animation in millseconds.
     *
     * Must be greater than or equal to the fade duration. Defaults to 20s.
     * This can also be set via the `slide-duration`-attribute.
     *
     * @type number
     */
    slideDuration: number;
    constructor();
    attributeChangedCallback(name: string, oldVal: string, newVal: string): void;
    connectedCallback(): void;
    private animateImages(images);
    private stop();
}
