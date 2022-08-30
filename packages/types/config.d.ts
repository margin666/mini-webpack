export type Rules = {
    test: RegExp;
    use: string | Function | Loader[]
}

export type Loader = {
    loader: string;
    [key:string]:any;
} 
export type Plugin = {
    apply: Function
}

export type Config = {
    entry: string;
    module?: {
        rules?: Rules[]
    },
    plugins?: Plugin[],
    root?: '.' | string,
}

