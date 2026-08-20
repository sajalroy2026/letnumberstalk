import { AbsoluteFill, Sequence } from "remotion";
import { PersistentBackground } from "./components/PersistentBackground";
import { Grain } from "./components/Grain";
import { SceneShell } from "./components/SceneShell";
import { Scene01ColdOpen } from "./scenes/Scene01ColdOpen";
import { Scene02ProblemBeat } from "./scenes/Scene02ProblemBeat";
import { Scene03Instrument } from "./scenes/Scene03Instrument";
import { Scene04Depth } from "./scenes/Scene04Depth";
import { Scene05SectorCalibration } from "./scenes/Scene05SectorCalibration";
import { Scene06Verdict } from "./scenes/Scene06Verdict";
import { Scene07Close } from "./scenes/Scene07Close";

export const MainVideo = () => {
  return (
    <AbsoluteFill>
      <PersistentBackground />
      <Sequence from={0} durationInFrames={75}>
        <SceneShell durationInFrames={75} fadeIn={8} fadeOut={14}>
          <Scene01ColdOpen />
        </SceneShell>
      </Sequence>
      <Sequence from={55} durationInFrames={105}>
        <SceneShell durationInFrames={105} fadeIn={10} fadeOut={16}>
          <Scene02ProblemBeat />
        </SceneShell>
      </Sequence>
      <Sequence from={140} durationInFrames={150}>
        <SceneShell durationInFrames={150} fadeIn={12} fadeOut={18}>
          <Scene03Instrument />
        </SceneShell>
      </Sequence>
      <Sequence from={270} durationInFrames={150}>
        <SceneShell durationInFrames={150} fadeIn={12} fadeOut={18}>
          <Scene04Depth />
        </SceneShell>
      </Sequence>
      <Sequence from={400} durationInFrames={120}>
        <SceneShell durationInFrames={120} fadeIn={10} fadeOut={16}>
          <Scene05SectorCalibration />
        </SceneShell>
      </Sequence>
      <Sequence from={505} durationInFrames={135}>
        <SceneShell durationInFrames={135} fadeIn={10} fadeOut={16}>
          <Scene06Verdict />
        </SceneShell>
      </Sequence>
      <Sequence from={620} durationInFrames={220}>
        <SceneShell durationInFrames={220} fadeIn={14} fadeOut={30}>
          <Scene07Close />
        </SceneShell>
      </Sequence>
      <Grain />
    </AbsoluteFill>
  );
};
