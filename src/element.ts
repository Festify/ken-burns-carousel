const enum Attributes {
    AnimationDirection = 'animation-direction',
    AnimationNames = 'animation-names',
    FadeDuration = 'fade-duration',
    Images = 'images',
    SlideDuration = 'slide-duration',
}

export const enum Direction {
    Normal = 'normal',
    Reverse = 'reverse',
    Random = 'random',
}

const html = `
<style>
    div {
        height: 100%;
        position: relative;
        overflow: hidden;
        width: 100%;
    }

    img {
        height: 100%;
        object-fit: cover;
        position: absolute;
        width: 100%;
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
            transform: scale(1.5) translate(-10%, -7%);
        }
    }
    @keyframes ken-burns-top-right {
        to {
            transform: scale(1.5) translate(-10%, 7%);
        }
    }
    @keyframes ken-burns-top-left {
        to {
            transform: scale(1.5) translate(10%, 7%);
        }
    }
    @keyframes ken-burns-bottom-left {
        to {
            transform: scale(1.5) translate(10%, -7%);
        }
    }
    @keyframes ken-burns-middle-left {
        to {
            transform: scale(1.5) translate(10%, 0);
        }
    }
    @keyframes ken-burns-middle-right {
        to {
            transform: scale(1.5) translate(-10%, 0);
        }
    }
    @keyframes ken-burns-top-middle {
        to {
            transform: scale(1.5) translate(0, 10%);
        }
    }
    @keyframes ken-burns-bottom-middle {
        to {
            transform: scale(1.5) translate(0, -10%);
        }
    }
    @keyframes ken-burns-center {
        to {
            transform: scale(1.5);
        }
    }
</style>

<div id="wrapper"></div>
`;

const defaultAnimationNames = [
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

export default class KenBurnsSlideshow extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            Attributes.AnimationDirection,
            Attributes.AnimationNames,
            Attributes.FadeDuration,
            Attributes.Images,
            Attributes.SlideDuration,
        ];
    }

    animationNames: string[] = defaultAnimationNames.slice();
    animationDirection: Direction = Direction.Random;

    private _fadeDuration: number = 2500;
    private _imgList: string[] = [];
    private _slideDuration: number = 20000;
    private _timeout: number = 0;
    private _wrapper: Element;

    get fadeDuration() {
        return this._fadeDuration;
    }

    set fadeDuration(val: number) {
        if (val > this.slideDuration) {
            throw new RangeError("Fade duration must be smaller than slide duration");
        }

        this._fadeDuration = val;
    }

    get images(): string[] {
        return this._imgList;
    }

    set images(images: string[]) {
        this._imgList = images;

        clearTimeout(this._timeout);
        this._timeout = 0;

        if (images.length > 0) {
            this.animate(images);
        }
    }

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
        this.shadowRoot!.innerHTML = html;

        this._wrapper = this.shadowRoot!.getElementById('wrapper')!;
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch (name) {
            case Attributes.AnimationDirection:
                this.animationDirection = newVal as Direction;
                break;
            case Attributes.AnimationNames:
                this.animationNames = newVal ? newVal.split(' ') : defaultAnimationNames;
                break;
            case Attributes.FadeDuration:
                this.fadeDuration = Number(newVal);
                break;
            case Attributes.Images:
                this.images = newVal ? newVal.split(' ') : [];
                break;
            case Attributes.SlideDuration:
                this.slideDuration = Number(newVal);
                break;
        }
    }

    private animate(images: string[]) {
        const insert = (index: number, el: HTMLImageElement) => {
            const url = images[index];

            const random = Math.random();
            const animationIndex = Math.floor(random * this.animationNames.length);
            const direction = this.animationDirection === Direction.Random
                ? random > .5 ? 'normal' : 'reverse'
                : this.animationDirection;

            el.style.animationName = `${this.animationNames[animationIndex]}, fade-in`;
            el.style.animationDuration = `${this.slideDuration}ms, ${this.fadeDuration}ms`;
            el.style.animationDirection = `${direction}, normal`;
            el.style.animationTimingFunction = 'linear, ease';

            this._wrapper.appendChild(el);
            setTimeout(() => el.remove(), this.slideDuration);

            // Preload next image and place it in browser cache
            const nextIndex = (index + 1) % images.length;
            const next = new Image();
            next.src = images[nextIndex];

            this._timeout = setTimeout(
                () => insert(nextIndex, next),
                this.slideDuration - this.fadeDuration,
            );
        };

        const img = new Image();
        img.src = images[0];
        img.onload = () => insert(0, img);
    }
}
