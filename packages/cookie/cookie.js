  
  /** ADCookie class. */
  export default class ADCookie {
    
    static create() {
      const instance = new ADCookie();
      return instance;
    }
    
    constructor(){
      this.init();
    }
    
    init() {
      this.defaultAttributes_ = { path: '/' };
    }
    
    set(name, value, attributes){
        if(typeof document === 'undefined') {
            return;
        }

        attributes = this.assign_({}, this.defaultAttributes_, attributes);

        if (typeof attributes.expires === 'number') {
            attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
        }
        if (attributes.expires) {
            attributes.expires = attributes.expires.toUTCString()
        }
      
        name = encodeURIComponent(name)
            .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
            .replace(/[()]/g, escape);
      
        let stringifiedAttributes = '';
        for (let attributeName in attributes) {
            if (!attributes[attributeName]) {
              continue;
            }
      
            stringifiedAttributes += '; ' + attributeName
      
            if (attributes[attributeName] === true) {
              continue;
            }
      
            // Considers RFC 6265 section 5.2:
            // ...
            // 3.  If the remaining unparsed-attributes contains a %x3B (";")
            //     character:
            // Consume the characters of the unparsed-attributes up to,
            // not including, the first %x3B (";") character.
            // ...
            stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
        }

        return (document.cookie =
            name + '=' + this.converterWrite_(value, name) + stringifiedAttributes);
    }

    get(name){

        if (typeof document === 'undefined' || (arguments.length && !name)) {
            return;
        }
      
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all.
        let cookies = document.cookie ? document.cookie.split('; ') : [];
        let jar = {};
        
        for (let i = 0; i < cookies.length; i++) {
            
            let parts = cookies[i].split('=');
            let value = parts.slice(1).join('=');
      
            try {
              let found = decodeURIComponent(parts[0]);
              jar[found] = this.converterRead_(value, found);
      
              if (name === found) {
                break;
              }
            } catch (e) {}
        }
      
        return name ? jar[name] : jar;
    }

    remove(name, attributes){
        this.set(
            name, 
            '', 
            this.assign_({}, attributes, {
                expires: -1
            })
        );
    }

    converterRead_(value){
      if (value[0] === '"') {
          value = value.slice(1, -1)
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    }

    converterWrite_(value){
      return encodeURIComponent(value).replace(
       /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
       decodeURIComponent
      )    
    }

    assign_(target){
        for (let i = 1; i < arguments.length; i++) {
            let source = arguments[i];
            for (let key in source) {
              target[key] = source[key];
            }
        }
        return target;
    }
  }
  
  export {ADCookie};