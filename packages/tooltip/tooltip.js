/**
 * MIT License
 * Copyright (c) 2021 A.D. Software Labs

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// import ADComponent from '../base/component';

const strings = {
  INSTANCE_KEY: 'ad-tooltip',
  MOUSE_OVER: 'mouseover',
  MOUSE_LEAVE: 'mouseleave',
  POS_Y: 'ad-tooltip-y',
  POS_X: 'ad-tooltip-x',
  TITLE: 'title',
  TOOLTIP_CL: 'ad-tooltip',
  TOOLTIP_SHOW_CL: 'ad-tooltip--show',
};

/**
 * Class representing a ADTooltip component.
 * @extends ADComponent
 */
export default class ADTooltip extends ad.component.ADComponent {
  /**
    * @param {!Element} root
    * @return {!ADTooltip}
    */
  static attachTo(root, ...args) {
    // Subclasses which extend ADComponent should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element.
    const instance = new ADTooltip(root, ...args);

    // Attach instance to the root
    root.ad = root.ad || {};
    root.ad[strings.INSTANCE_KEY] = instance;
    return instance;
  }

  /**
    * @param {!Element} root
    * @return {!ADTooltip}
    */
  static getInstance(root) {
    return root.ad && root.ad[strings.INSTANCE_KEY] ?
      root.ad[strings.INSTANCE_KEY] : null;
  }

  /**
   * @param {...?} args
   */
  init(...args) {
    let maxLength = 250;
    if (args.length > 0) {
      const obj = args[0];
      maxLength = obj.maxLength;
    }
    this.maxLength_ = maxLength;

    // Create and load tooltip element
    this.reset();

    // Set position if explicitly specified
    const y = this.root_.getAttribute(strings.POS_Y);
    const x = this.root_.getAttribute(strings.POS_X);
    if (x && y) {
      this.setPosition(x, y);
    }

    // Attach event handlers
    this.listen(strings.MOUSE_OVER, (e)=>this.mouseOverEventHandler_(e));
    this.listen(strings.MOUSE_LEAVE, (e)=>this.mouseOutEventHandler_(e));

    // Attacch window resize handler 
    window.addEventListener('resize', (e)=>this.windowResizeHandler_(e));
  }

  /**
    * @param {!number} x - position
    * @param {!number} y - position
    */
  setPosition(x, y) {
    this.x_ = x;
    this.y_ = y;
  }

  /** Reload function used to reload tooltip if a source was updated */
  reset() {
    // Get title attriute's content and remove it
    const toolTipContent =
      this.toolTipContent_ = this.root_.getAttribute(strings.TITLE);
    this.root_.removeAttribute(strings.TITLE);

    // Create and add tooltip html
    if (!this.toolTip_) {
      const tooltip = document.createElement('span');
      tooltip.classList.add(strings.TOOLTIP_CL);
      tooltip.innerHTML = toolTipContent;

      this.toolTip_ = tooltip;
      // Depricated - this approach is used for IE 11. Will be phased out
      // once IE is no longer supported.
      // this.root_.insertAdjacentElement('afterend', tooltip);
      this.insertAfter_(this.root_, tooltip);
    } else {
      this.toolTip_.innerHTML = toolTipContent;
    }
    
    let whiteSpace = 'nowrap';
    let maxWidth = 'none';
    if (this.toolTip_.clientWidth > this.maxLength_) {
      whiteSpace = 'normal';
      maxWidth = this.maxLength_ + 'px';
    }

    this.toolTip_.style['white-space'] = whiteSpace
    this.toolTip_.style['max-width'] = maxWidth;

  }

  /**
    * @private
    */
  mouseOverEventHandler_() {
    this.toolTip_.classList.add(strings.TOOLTIP_SHOW_CL);
  }

  /**
    * @private
    */
  mouseOutEventHandler_() {
    this.toolTip_.classList.remove(strings.TOOLTIP_SHOW_CL);
  }
  /**
    * @private
    */
  windowResizeHandler_(){
    const pos = this.getTooltipPosition_();
    this.setPosition_(pos.x, pos.y);
  }
  /**
    * @private
    * @return {!Object} - object {y=x, x=x} returns postio of the tooltip
    * element
    */
  getTooltipPosition_() {
    let x;
    let y;
    if (this.x_ && this.y_) {
      x = this.x_;
      y = this.y_;
    } else {
      const elRec = this.root_.getBoundingClientRect();
      const ttRec = this.toolTip_.getBoundingClientRect();

      const center = elRec.left + elRec.width/2;
      let left = center - (this.toolTip_.clientWidth)/2; // 8 is once side padding

      // Left breaker
      if (left < 0) {
        // A threshold distance of 32px is expected
        // to be maintained between the tooltip and the viewport edge.
        left = 32;
      }

      // Right breaker
      const screenWidth = document.body.clientWidth;

      if (left + ttRec.width + 8 > screenWidth) {
        // A threshold distance of 32px is expected
        // to be maintained between the tooltip and the viewport edge.
        left = screenWidth - this.toolTip_.clientWidth - 32;
      }
      x = left;
      y = elRec.bottom + 8;
    }
    return {
      y: y,
      x: x,
    };
  }

  /**
    * @private
    * @param {!number} x - position
    * @param {!number} y - position
    */
  setPosition_(x, y) {
    this.toolTip_.style.left = x + 'px';
    this.toolTip_.style.top = y + 'px';
  }

  /**
    * @private
    * @param {!Element} referenceElement - referenceElement
    * @param {!Element} newElement - newElement
    */
  insertAfter_(referenceElement, newElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
  }
}

export {ADTooltip};
