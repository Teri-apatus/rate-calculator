declare module '*.svg' {
    const path: string;
    export default path;
}

declare interface WebpackRequire {
    context(
        path: string,
        deep?: boolean,
        filter?: RegExp
    ): {
        keys(): string[];
        (id: string): string;
    };
}

interface NodeRequire extends WebpackRequire {}
