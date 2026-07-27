export interface Target {
    name: string;
    build: () => Promise<void>;
    incrementalBuild?: () => Promise<void>;
}
