import IOHandler from "./io/IOHandler";

export interface ProxyStoreOptions<T extends object> {
    init?: T | boolean;
}

export default class ProxyStore<T extends object = object> implements ProxyHandler<any> {
    public declare proxy: T;
    public declare handler: IOHandler<T>;
    readonly #store: T = {} as T;

    constructor(handler: string | IOHandler<T>, { init = true }: ProxyStoreOptions<T> = {}) {
        if (typeof handler === 'string') {
            throw TypeError('Handler string not implemented yet')
        }
        else {
            this.handler = handler;
        }

        if (init === true) {
            this.load()
        }
        else if (typeof init === 'object') {
            this.#store = init || ({} as T);
        }

        this.proxy = new Proxy<T>(this.#store, this);
    }

    save() {
        this.handler.save(this.#store)
    }

    load() {
        Object.assign(this.#store, this.handler.load())
    }

    set(target: any, prop: PropertyKey, val: any) {
        target[prop] = val;
        this.save()
        return true;
    }

    get(target: any, prop: PropertyKey): any {
        const val: unknown = target[prop];
        if (typeof val === "object" && val) {
            return new Proxy(val, this);
        }
        return val;
    }

    deleteProperty(target: any, prop: PropertyKey) {
        delete target[prop];
        this.save()
        return true
    }
}
