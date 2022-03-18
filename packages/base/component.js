/* const cssClasses = {};*/

const strings = {
  INSTANCE_KEY: 'ad-base',
};

/** Class representing a base ADComponent. */
export default class ADComponent {
  /**
   * @param {!Element} root
   * @return {!ADComponent}
   */
  static attachTo(root, ...args) {
    // Subclasses which extend ADComponent should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element.
    const instance = new ADComponent(root, ...args);

    // Attach instance to the root
    root.ad = root.ad || {};
    root.ad[strings.INSTANCE_KEY] = instance;
    return instance;
  }

  /**
   * @param {!Element} root
   * @return {!ADComponent}
   */
  static getInstance(root) {
    return root.ad && root.ad[strings.INSTANCE_KEY] ?
      root.ad[strings.INSTANCE_KEY] : null;
  }

  /**
   * @param {!Element} root
   * @param {...?} args
   */
  constructor(root, ...args) {
    /** @protected {!Element} */
    this.root_ = root;
    this.init(...args);
    this.initSyncWithDOM();
  }

  /**
   * @param {...?} args
   */
  init(/* ...args*/) {
    // Subclasses can override this to do any additional setup work that would be considered part of a
    // "constructor". Essentially, it is a hook into the parent constructor before the component is
    // initialized. Any additional arguments besides root will be passed in here.
  }

  initSyncWithDOM() {
    // Subclasses should override this method if they need to perform work to synchronize with a host DOM
    // object. An example of this would be a form control wrapper that needs to synchronize its internal state
    // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
    // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
  }

  destroy() {
    // Subclasses may implement this method to release any resources / deregister any listeners they have
    // attached. An example of this might be deregistering a resize event from the window object.
  }

  /**
   * Wrapper method to add an event listener to the component's root element. This is most useful when
   * listening for custom events.
   * @param {!string} evtType
   * @param {!Function} handler
   */
  listen(evtType, handler) {
    this.root_.addEventListener(evtType, handler);
  }

  /**
   * Wrapper method to remove an event listener to the component's root element. This is most useful when
   * unlistening for custom events.
   * @param {!string} evtType
   * @param {!Function} handler
   */
  unlisten(evtType, handler) {
    this.root_.removeEventListener(evtType, handler);
  }

  /**
   * Fires a cross-browser-compatible custom event from the component root of the given type,
   * with the given data.
   * @param {!string} evtType
   * @param {Object?} evtData
   * @param {boolean=} shouldBubble
   */
  emit(evtType, evtData, shouldBubble = false) {
    let evt;
    if (typeof CustomEvent === 'function') {
      evt = new CustomEvent(evtType, {
        detail: evtData,
        bubbles: shouldBubble,
      });
    } else {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(evtType, shouldBubble, false, evtData);
    }

    this.root_.dispatchEvent(evt);
  }

  /**
   * Create html element
   * @param {!string} html
   */
  createElement(html) {
    const el = document.createElement('div');
    el.innerHTML = html;
    return el.firstChild;
  }
}

export {ADComponent};
