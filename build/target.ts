export interface Target {
    kind: "target";
    name: string;
    build(): Promise<void>;
}

export interface IncrementalTarget extends Target {
    kind: "incremental";
    incrementalBuild(): Promise<void>;
}
