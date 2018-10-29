(function(a,b){'object'==typeof exports&&'undefined'!=typeof module?module.exports=b():'function'==typeof define&&define.amd?define(b):a.KenBurnsCarousel=b()})(this,function(){'use strict';function a(a,b){if(a===b||!a&&!b)return!0;if(!a||!b||a.length!==b.length)return!1;for(let c=0;c<a.length;c++)if(a[c]!==b[c])return!1;return!0}const b=['ken-burns-bottom-right','ken-burns-top-left','ken-burns-bottom-left','ken-burns-top-right','ken-burns-middle-left','ken-burns-middle-right','ken-burns-top-middle','ken-burns-bottom-middle','ken-burns-center'],c=document.createElement('template');c.innerHTML=`
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
`,'object'==typeof window.ShadyCSS&&window.ShadyCSS.prepareTemplate(c,'ken-burns-carousel');class d extends HTMLElement{constructor(){super(),this.animationNames=b,this.animationDirection='random',this._fadeDuration=2500,this._imgList=[],this._slideDuration=2e4,this._timeout=0,this._zCounter=0,this.attachShadow({mode:'open'}),this.shadowRoot.appendChild(c.content.cloneNode(!0))}static get observedAttributes(){return['animation-direction','animation-names','fade-duration','images','slide-duration']}get fadeDuration(){return this._fadeDuration}set fadeDuration(a){if(a>this.slideDuration)throw new RangeError('Fade duration must be smaller than slide duration');this._fadeDuration=a}get images(){return this._imgList}set images(b){a(this._imgList,b)||(this._imgList=b,0<b.length?this.animateImages(b):this.stop())}get slideDuration(){return this._slideDuration}set slideDuration(a){if(a<this.fadeDuration)throw new RangeError('Slide duration must be greater than fade duration');this._slideDuration=a}attributeChangedCallback(a,c,d){'animation-direction'===a?this.animationDirection=d:'animation-names'===a?this.animationNames=d?d.split(' ').filter((a)=>a):b:'fade-duration'===a?this.fadeDuration=+d:'images'===a?this.images=d?d.split(' ').filter((a)=>a):[]:'slide-duration'===a?this.slideDuration=+d:void 0}connectedCallback(){'object'==typeof window.ShadyCSS&&window.ShadyCSS.styleElement(this)}animateImages(b){const c=(a,d)=>{const e=Math.random(),f=Math.floor(e*this.animationNames.length),g='random'===this.animationDirection?.5<e?'normal':'reverse':this.animationDirection,h=document.createElement('div');h.appendChild(d),h.style.animationName=`${this.animationNames[f]}, fade-in`,h.style.animationDuration=`${this.slideDuration}ms, ${this.fadeDuration}ms`,h.style.animationDirection=`${g}, normal`,h.style.animationTimingFunction='linear, ease',h.style.zIndex=this._zCounter++ +'',this.shadowRoot.appendChild(h),setTimeout(()=>h.remove(),this.slideDuration);const i=(a+1)%b.length,j=document.createElement('img');j.src=b[i],this._timeout=setTimeout(()=>c(i,j),this.slideDuration-this.fadeDuration)},d=document.createElement('img');d.src=b[0],d.onload=()=>{a(this._imgList,b)&&(this.stop(),c(0,d))}}stop(){clearTimeout(this._timeout),this._timeout=0}}return customElements.define('ken-burns-carousel',d),d});
//# sourceMappingURL=ken-burns-carousel.min.js.map
