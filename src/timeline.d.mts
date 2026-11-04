export type TimedScene = {durationFrames: number; transition: {durationFrames: number}};
export function buildTimeline(scenes: TimedScene[]): {clips: {index: number; from: number; durationInFrames: number; overlapAfter: number}[]; durationInFrames: number};
export function reviewFrames(scenes: TimedScene[]): number[];
