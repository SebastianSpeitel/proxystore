export type loadHandler<T extends object> = () => T;
export type saveHandler<T extends object> = (store: T) => void | Promise<void>;

export default interface IOHandler<T extends object> {
  load: loadHandler<T>;
  save: saveHandler<T>;
}
