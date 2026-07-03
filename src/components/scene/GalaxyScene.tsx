import React from 'react';
import StarField from './StarField';
import Nebula from './Nebula';
import CameraRig from './CameraRig';
import PostFX from './PostFX';

export interface GalaxySceneProps {
  starCount?: number;
  bloom?: boolean;
  nebula?: boolean;
  /** false → prefers-reduced-motion: freeze continuous drift/rotation */
  animate?: boolean;
}

/** Pure scene-graph composition — no logic of its own. */
const GalaxyScene: React.FC<GalaxySceneProps> = ({
  starCount = 8000,
  bloom = true,
  nebula = true,
  animate = true,
}) => (
  <>
    <StarField count={starCount} animate={animate} />
    {nebula && <Nebula />}
    {animate && <CameraRig />}
    <PostFX enabled={bloom} />
  </>
);

export default GalaxyScene;
