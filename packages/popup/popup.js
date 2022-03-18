/* const cssClasses = {}; */

//import ADComponent from '../base/component';

const strings = {
  INSTANCE_KEY: 'ad-pupup',
  ANCOR: 'ad-popup-ancor',
  TARGET: 'ad-popup-target',
  OPEN: 'ad-popup--open'
};

/** ADPopUp class. */
export default class ADPopUp extends ad.component.ADComponent {
  /**
     * @param {!Element} root
     * @return {!ADPopUp}
     */
  static attachTo(root, ...args) {
    // Subclasses which extend ADPopUp should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element.
    const instance = new ADPopUp(root, ...args);

    // Attach instance to the root
    root.ad = root.ad || {};
    root.ad[strings.INSTANCE_KEY] = instance;
    return instance;
  }

  /**
     * @param {!Element} root
     * @return {!ADPopUp}
     */
  static getInstance(root) {
    return root.ad && root.ad[strings.INSTANCE_KEY] ?
      root.ad[strings.INSTANCE_KEY] : null;
  }

  /**
     * @param {...?} args
     *  *  Setting bject optional
     *  {
     *    top = 99, // top position
     *    left = 99  // left posiion
     *    template: '' html template of the popup window (optional)
     *    keepOpened: keep window opened 
     *  }
     */
  init(...args) {
    const $this = this;
    let settings;

    if (args.length > 0) {
      settings = args[0];
      $this.top_ = settings.top;
      $this.left_ = settings.left;
      $this.template_ = settings.template;
      $this.keepOpened_ = settings.keepOpened;
    }

    let popup = null;
    if (settings && settings.template) {
      // Set specified popup window
      popup = $this.setTemplate_(settings.template);
      // Insert popup right after the root element 
      $this.root_.insertAdjacentElement('afterend', popup);
    } else {
      // Find popup window on the page
      const target = $this.root_.getAttribute(strings.ANCOR);
      popup = document.querySelector(`[${strings.TARGET}=${target}]`); 
    }

    $this.popup_ = popup;
    // Set specified position
    //if ($this.top_ && $this.left_) {
    //  $this.setPosition_($this.left_, $this.top_);
    //}

    $this.listen('click', (e) => {
      e.stopPropagation();
      $this.open();
    });
  }

  /**
  * @public
  * Close popup window
  */
  close() {
    this.popup_.classList.remove(strings.OPEN);
    if(!this.keepOpened_){
      document.body.removeEventListener('click', (e)=>{
        this.handleBodyClick_(e);
      });
    }
  }

  /**
     * @public
     * Open popup window
     */
  open() {
    const pos = this.getPopupPosition_();
    this.setPosition_(pos.left, pos.top);
    this.popup_.classList.add(strings.OPEN);
    if(!this.keepOpened_){
      document.body.addEventListener('click', (e)=>{
        this.handleBodyClick_(e);
      });
    }
  }

  /**
      * @private
      * Get popup window position based on the ancor position
      * or specified position throug the settings
      */
  getPopupPosition_() {
    let top;
    let left;
    if (this.left_ && this.top_) {
      left = this.left_;
      top = this.top_;
    } else {
      // A threshold distance of 32px is expected
      // to be maintained between the tooltip and the viewport edge.
      let breaker = 32;
      if (this.breaker_) {
        breaker = this.breaker_;
      }
      const popup = this.popup_;
      const elRec = this.root_.getBoundingClientRect();

      const center = elRec.left + elRec.width/2;
      left = center - (popup.clientWidth)/2;

      // Left breaker
      if (left < breaker) {
        left = breaker;
      }

      // Right breaker
      const screenWidth = window.innerWidth;

      if (left + popup.clientWidth + breaker > screenWidth) {
        left = screenWidth - popup.clientWidth - breaker;
      }
      left = left;
      top = elRec.bottom + 8;
    }
    return {
      top: top,
      left: left,
    };
  }

  /**
      * @private
      * @param {!number} top - position
      * @param {!number} left - position
      */
  setPosition_(left, top) {
    this.popup_.style.left = left + 'px';
    this.popup_.style.top = top + 'px';
  }

  /**
   * @private
   * @param {!string} template - html template
   */
  setTemplate_(template) {
    template = this.createElement(template);
    return template;
  }

  /**
   * @private
   * @param {!Event} ev - event
   */
  handleBodyClick_(ev){
    if(this.isElementConrainer_(ev.target)){
      return;
    }
    this.close();
  }

   /**
   * @private
   * @param {!Element} element - html element
   */  
  isElementConrainer_(element){
    return this.popup_ === element ||
      this.popup_.contains(element);
  }
}

export {ADPopUp};