declare global {
    export interface Window {
        noSSR: boolean;
        __APOLLO_STATE__: any;
    }
}

export declare var Window: {
    prototype: Window;
    new(): Window;
    noSSR: boolean;
    __APOLLO_STATE__: any;
};
