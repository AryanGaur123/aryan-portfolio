uniform float uTime;

varying vec3 vColor;

void main() {
  // Soft radial glow — bright core with a long falloff tail,
  // reads as a glowing star rather than a hard disc.
  float d = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / max(d, 0.01) - 0.1;
  strength = clamp(strength, 0.0, 1.0);

  gl_FragColor = vec4(vColor * strength, strength);

  #include <colorspace_fragment>
}
