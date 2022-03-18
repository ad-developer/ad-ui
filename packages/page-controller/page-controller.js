// import ADComponent from '../base/component';

const strings = {
  INSTANCE_KEY: 'ad-page-controller',
};

export default class ADPageController extends ad.component.ADComponent {
  /**
    * @param {!Element} root
    * @return {!ADController}
    */
  static attachTo(root, ...args) {
    // Subclasses which extend ADComponent should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element.
    const instance = new ADPageController(root, ...args);

    // Attach instance to the root
    root.ad = root.ad || {};
    root.ad[strings.INSTANCE_KEY] = instance;
    return instance;
  }

  /**
    * @param {!Element} root
    * @return {!ADController}
    */
  static getInstance(root) {
    return root.ad && root.ad[ADPageController.strings.INSTANCE_KEY] ?
      root.ad[strings.INSTANCE_KEY] : null;
  }

  init() {
    // Package Controller
    // Ajax Controller
    // Socket Controller
    // Cache Controller
    // State controller
  }
}

export {ADPageController};
