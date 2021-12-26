
/**
  * 防抖
  * （当持续触发事件时，
  * 一定时间段内没有再触发事件，
  * 事件处理函数才会执行一次，
  * 如果设定的时间到来之前，
  * 又一次触发了事件，
  * 就重新开始延时）
  * @param fn 函数
  * @param wait 延时毫秒数
  * @param immediate 是否立即执行
  */
/* istanbul ignore next */
export function debounce<T extends Function>(fn: T, wait: number, immediate: boolean = false): (T & { cancle(): void; }) { // eslint-disable-line
    let handle: number, ret = null;

    const debounced = function () {
        clearTimeout(handle);
        if (immediate === true) {
            if (!handle) {
                ret = fn(...arguments); // eslint-disable-line
            }
            handle = setTimeout(() => fn(...arguments), wait); // eslint-disable-line
        } else {
            handle = setTimeout(() => fn(...arguments), wait); // eslint-disable-line
        }
        return ret;
    };

    debounced.cancal = function () {
        clearTimeout(handle);
        handle = 0;
    };

    return debounced as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
  * 节流
  * （当持续触发事件时，
  * 保证一定时间段内只调用一次事件处理函数）
  * @param fn 函数
  * @param wait 间隔毫秒数
  * @param options 配置项
  */
/* istanbul ignore next */
export function throttle<T extends Function>(fn: T, wait: number, { // eslint-disable-line
    leading = true,
    trailing = true
} = {}): (T & { cancle(): void; }) {
    let handle: number, previous = 0;

    const throttled = function () {
        const now = Date.now();
        if (!previous && !leading) {
            previous = now;
        }
        const remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (handle) {
                clearTimeout(handle);
                handle = 0;
            }
            previous = now;
            fn(...arguments); // eslint-disable-line
        } else if (!handle && trailing) {
            handle = setTimeout(() => {
                previous = !leading ? 0 : Date.now();
                handle = 0;
                fn(...arguments); // eslint-disable-line
            }, remaining);
        }
    };
    
    throttled.cancle = function () {
        clearTimeout(handle);
        previous = 0;
        handle = 0;
    };
    return throttled as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
