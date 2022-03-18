
export default class ADAjax {


    constructor(...args){
        this.xhr_ = null;
        this.init(args);
    }

    static buid(...args){
        const instance = new ADAjax(args);
        return instance;
    }

    init(...args){
        this.xhr_ = new XMLHttpRequest();
    }

    get(url, header, result){
        const $this = this;
    }

    posst(url, data, header, result){

    }
}

export {ADAjax}