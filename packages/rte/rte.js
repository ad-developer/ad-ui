/* const cssClasses = {};*/

const strings = {
  INSTANCE_KEY: 'ad-rte',
};

const btns = [
  [
    '<svg viewbox="0 0 24 24"><g><rect fill=none height=24 width=24 /></g><g><path d="M16,11h-1V3c0-1.1-0.9-2-2-2h-2C9.9,1,9,1.9,9,3v8H8c-2.76,0-5,2.24-5,5v7h18v-7C21,13.24,18.76,11,16,11z M19,21h-2v-3 c0-0.55-0.45-1-1-1s-1,0.45-1,1v3h-2v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H9v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H5v-5 c0-1.65,1.35-3,3-3h8c1.65,0,3,1.35,3,3V21z"/></g></svg>', // icon
    ()=>{
      this.formatDoc('cut');
      this.changeHandler();
    },
    'Cut',
  ],
  [
    '<svg viewbox="0 0 24 24"><path d="M0 0h24v24H0z"fill=none /><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>',
    () =>{
      const oPrntWin = window.open('', '_blank', 'width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes');
      oPrntWin.document.open();
      oPrntWin.document.write('<!doctype html><html><head><title>Print<\/title><\/head><body onload="print();">' + this.editor_.innerHTML + '<\/body><\/html>');
      oPrntWin.document.close();
    },
    'Print',
  ],
];

export default class ADRte extends ad.component.ADComponent {
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
    // Init  wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('ad-rte-wrapper');

    this.wrapper_ = wrapper;

    // Init toolbars objext
    this.toolsbars_ = {};

    // Create toolbars toolbars
    this.createToolbar('general');
    this.addToolbarItems('genToolbar', btns);

    // const formToolbar = this.createToolbar('format');
    // this.addToolbarItems(genToolbar, btns);


    this.initToolbar_(strings.TOOLBAR_TOP);
    this.initToolbar_(string.TOOLBAR_BOTTOM);

    // Init editor pad
    $this.initEditor_();

    // Replace the controls
    $this.root_.style.display = 'none';
    $this.root_.style.visibility = 'hidden';
    $this.insertAfter_(wp, $this.root_);
  }

  /**
      * Add tolbar item.
      * @param {!string} - toolbar
      * @param {!Array}
      *     - array of toolbar elemt parameters
      *     the following format is used
      *     [icon html|element html, handler, tooltip, element type]
      */
  addToolbarItem(toolbar, item) {
    const icon = item[0];
    const handler = item[1];
    const tooltip = item[2];

    const btn = document.createElement('button');
    btn.innerHTML = icon;

    // Set the proper event type
    let event = 'click';
    if (item.length > 3) {
      // Check if the element type
      // is other than button
      // then event will be 'change'
      if (item[3]) {
        event = 'change';
      }
    }

    btn.addEventListener(event, (e)=>{
      handler.call(this, e);
    });

    this.toolsbars_[toolbar]
      .appendChild(btn);
  }

  /**
      * Add tolbar item.
      * @param {!string} - toolbar
      * @param {!Array} - array of toolbar elemts parameters
      */
  addToolbarItems(toolbar, items) {
    for (let i = 0, item; item = items[i]; i++) {
      this.addToolbarItem(toolbar, item);
    }
  }

  /**
      * Toolbar name.
      * @param {!string} name
      */
  createToolbar(name) {
    const toolBar = document.createElement('div');
    toolBar.classList.add('ad-rte-toolbar');
    this.toolsbars_[name] = toolBar;
  }

  formatDoc(cmd, value) {
    this.editor_.focus();
    document.execCommand(cmd, false, value);
    this.editor_.focus();
  }

  changeHandler() {
    this.root_.value = this.editor_.innerHTML;
    this.emit(this.root_, 'change');
  }
}

export {ADRte};
