/* const cssClasses = {};*/

//import ADComponent from '../base/component';

const strings = {
    INSTANCE_KEY: 'ad-form',
    MULTISELECT_ATTR: 'ad-ms-default-text'
  };
  
  /** Class representing a base ADForm. */
  export default class ADForm extends ad.component.ADComponent {
    /**
     * @param {!Element} root
     * @return {!ADForm}
     */
    static attachTo(root, ...args) {
      // Subclasses which extend ADForm should provide an attachTo() method that takes a root element and
      // returns an instantiated component with its root set to that element.
      
      const obj = {
        validator: (root) => new ad.advalidator.ADValidator(root)
      };
      
      let nObj = null;
      if(args.length > 0){
        nObj = Object.assign(obj, arg[0]);
      }

      const instance = new ADForm(root, nObj);
  
      // Attach instance to the root
      root.ad = root.ad || {};
      root.ad[strings.INSTANCE_KEY] = instance;
      return instance;
    }
  
    /**
     * @param {!Element} root
     * @return {!ADForm}
     */
    static getInstance(root) {
      return root.ad && root.ad[strings.INSTANCE_KEY] ?
        root.ad[strings.INSTANCE_KEY] : null;
    }
  
    /**
     * @param {...?} args
     */
    init(...args) {
        const $this = this;
        const settings = args[0];

        const formMetaData = settings.formMetaData;
        if(formMetaData){
            $this.build(formMetaData);
        }

        $this.controls_ = null;
        $this.createControlList_();
        
        $this.traceControls_();

        // Init validator
        $this.validator_ = settings.validator($this.root_);
    }

    /**
     * 
     * @param {!Object} data. Data is a json based object in the 
     * key - value format
     * {
     *  name: 'John Smith',
     *  phoneNumber: '8888888888'
     * } 
     * The method will go over the all keys and try to find element fo the form 
     * with the matching ad-id. 
     */
    setData(data){
        // Remove tracing to prevent firing 
        //form.change event 
        this.traceControls_(true);
        
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const value = data[key];
                const el = this.root_.querySelector(`[ad-id="${key}"]`);
                if (el) {
                    
                    let processed = flase;
                    // Text area or ADRte
                    if(el.tagName === 'TEXTAREA'){
                        
                        // See if ADRte is used 
                        if(ad.ADRte){
                            // Try to get instance of the ADRte
                            const inst = ad.ADRte.getInstance(el);
                            if(inst){
                                inst.set(value);
                                processed = true;
                            } 
                        } 
                    // multiselect        
                    } else if(el.hasAttribute(string.MULTISELECT_ATTR)){
                        
                        let inst;
                        if(inst = this.isMultislect_()){
                            inst.selectedData(value);
                            processed = true;
                        }
                        
                        // Check box or radio button 
                    } else if(this.isClickType_(el)){
                        el.checked = this.toBool_(value);
                        processed = true;
                        // Everything else     
                    } else {
                        if(el.nodeType === 'DIV' || el.nodeType === 'SPAN'){
                            el.innerHTML = this.htmlDecript_(value);
                            processed = true;
                        }
                    }
                    if(!processed){
                        el.value = this.htmlDecript_(value);
                    }
                    if(el.nodeType === 'SELECT'){
                        // TODO: This is a placeholder for 
                        // potential change event trigger on the 
                        // select control.
                    }
                }
            }
        }

        // Set tracing 
        this.traceControls_(true);
    }

    getData() {
        if(this.validator_.isValid()){
            const res = {};
            this.controls_.forEach(el => {
                let value;
                if(el.hasAttribute(string.MULTISELECT_ATTR)){
                    let inst;
                    if(inst = this.isMultislect_(el)){
                        value = inst.getSelectedData();
                    }
                } else {
                    value = el.getAttribute('ad-data');
                    if(!value){
                        if(this.isClickType_(el)){
                            value = this.toInt_(el.checked);
                        } else {
                            value = el.value;
                        }
                    }
                }
                res[el.getAttribute('ad-id')] = this.htmlEncript_(value);
            });
            return res;
        }
    }

    clear(){
         // Remove tracing to prevent firing 
        //form.change event 
        this.traceControls_(true);

        this.controls_.forEach(el => {
            
            let processed = false;
            let inst;
            if(el.hasAttribute(strings.MULTISELECT_ATTR)){
                if(inst = this.isMultislect_(el)){
                    inst.clear();
                    processed = true;
                }
            } else if(el.tagName === 'TEXTAREA'){
                if(inst = this.isRte_(el)){
                    inst.clear()
                    processed = true;
                }
            } else if(el.tagName === 'SELECT'){
                this.clearSelect_(el);
                processed = true;
            } else if(inst = this.isClickType_(el)){
                el.checked = false;
                processed = true;
            } else if(el.tagName === 'DIV' || el.tagName === 'SPAN'){
                el.innerHTML = '';
                processed = true;
            } 
            
            if(!processed){
                el.value = '';
            }
        });
        
        // Set tracing 
        this.traceControls_(true);
        
        // Remove validator errors
        // this will be replaced by the validator 
        // api validarot.clearErrors(); 
        const errors = this.root_.querySelectorAll('.ad-error');
        errors.forEach(el => {
            el.classList.remove('ad-error');
        });
    }
    /**
     * 
     * @param {!Object} formMetaData is json based object.
     * {
     *  element: 'div',
     *  attributes: [{attribute: '', value":''],
     *  children: [
     *              {
     *               element: div, 
     *               attributes:, 
     *               children:[]
     *              }
     *  ],
     *  observe: {
     *              elementId; '', 
     *              event: '', 
     *              value: ''
     *  }
     * } 
     */
    build(formMetaData){
        throw 'Not implemented';
    }

    /**
     * @private
     * Creates control list. 
     */
    createControlList_(){
        const controls = this.root_.querySelectorAll('[ad-id]');
        this.controls_ = controls;
    }
    
    /**
    * @private
    * @param {boolean} untrace - untrace(true)/trace(false) 
    */
    traceControls_(untrace){
        for (let i = 0, el, eventType = 'blur'; el = this.controls_[i++];) {
            
            if(el.nodeType === 'SELECT'){
                eventType = 'change';
            } else if(this.isClickType_(el)){
                eventType = 'click';
            }
            if(untrace){
                el.removeEventListener(eventType, this.traceControlHandler_);
            } else {
                el.addEventListener(eventType, this.traceControlHandler_);
            }
        }
    }

    /**
     * @private
     * @param {!Event} e - element event 
     */
    traceControlHandler_(e){
        this.emit('form.change', {event: e});
    }
    
    /**
     * @private
     * @param {!Element} el 
     * @returns {boolean} 
     */
    isClickType_(el){
        const res = el.matches('[type="checkbox"]') 
            || el.matches('[type="radio"]');

        return res;
    }

    /**
     * @private
     * @param {!string} value 
     * @returns {boolean}
     */
    toBool_(value){
        value = parseInt(value);
        return !!value;
    }

    toInt_(value){
        return value? 1: 0;
    }

    /**
     * @private
     * @param {Object} data 
     * @returns {string}
     */
    htmlDecript_(data){
        let res = data;
        if(data && typeof data === 'string'){
            res = data.replace(/&#39;/g, "'");
            res = data.replace(/&quot;/g, '"');
        } 
        return res;
    }

    /**
     * @private
     * @param {Object} data 
     * @returns {string}
     */
     htmlEncript_(data){
        let res = data;
        if(data && typeof data === 'string'){
            res = data.replace(/'/g, '&#39;');
            res = data.replace(/"/g, '&quot;');
        } 
        return res;
    }

    isMultislect_(el){
        if(ad.ADMultiselect){
            return el = ad.ADMultiselect.getInstance(el);
        }
    }
    
    isRte_(el){
        if(ad.ADRte){
            return el = ad.ADRte.getInstance(el);
        }
    }

    clearSelect_(el){
        const options = el.querySelectorAll('options');
        for (let index = 0, l =  options.length; index < l ; index++) {
            options[i].selected = options[i].defaultSelected;
        }
    }
  }
  
  export {ADForm};