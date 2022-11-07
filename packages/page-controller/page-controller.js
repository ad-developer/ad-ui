// import ADComponent from '../base/component';

export default class ADPageController extends ad.component.ADComponent {
  
  get instanceKey(){
    return 'ad-page-controller';
  }

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
    root.ad[ADPageController.instanceKey] = instance;
    return instance;
  }

  /**
    * @param {!Element} root
    * @return {!ADController}
    */
  static getInstance(root) {
    return root.ad && root.ad[ADPageController.instanceKey] ?
      root.ad[ADPageController.instanceKey] : null;
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
