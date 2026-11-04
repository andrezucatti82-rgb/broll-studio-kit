// Scene durations are editorial decisions, expressed in integer frames.
export function buildTimeline(scenes) {
  let cursor = 0;
  const clips = scenes.map((scene, i) => {
    const clip = {index: i, from: cursor, durationInFrames: scene.durationFrames,
      overlapAfter: scenes[i + 1]?.transition.durationFrames ?? 0};
    cursor += scene.durationFrames;
    return clip;
  });
  return {clips, durationInFrames: cursor};
}
export function reviewFrames(scenes) {
  const {clips, durationInFrames} = buildTimeline(scenes);
  return [...new Set(clips.flatMap(c => [c.from, c.from + Math.floor(c.durationInFrames / 2),
    c.from + c.durationInFrames - 1, c.from + (scenes[c.index].transition.durationFrames || 0)]))]
    .filter(f => f >= 0 && f < durationInFrames).sort((a, b) => a - b);
}
