


interface Handlers  {
    callback:(...payload)=> void,
    _this: any[]
}
type EventMap = Map<string,Handlers[]>





class StorageBus {

    eventMap: EventMap


    constructor(){

        this.eventMap = new Map()

 
    }

    effect(){}


    on(eventName:string,eventCallback,args) {

        let handlers = this.eventMap.get(eventName)

        if(!handlers) {

            handlers = []
           
        }
        handlers.push({
            callback:eventCallback,
            _this:args
        })

        this.eventMap.set(eventName,handlers)

              console.log('this.eventMap',this.eventMap);
        
     }

    off(){ }


    emit(eventName:string,...payload){
        
        const handlers = this.eventMap.get(eventName)


        if(!handlers) return 

        handlers.forEach(handle=>{
            handle.callback.apply(handle._this,payload)
        })
    }


    
}

export default StorageBus
export {
    EventMap
}