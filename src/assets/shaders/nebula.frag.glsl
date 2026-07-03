uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

varying vec2 vUv;

// Simplex-style value noise + fbm — cheap, good-enough cloud structure
// for a background element (no volumetric raymarching).
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(13.7, 7.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv - 0.5;

  float t = uTime * 0.02;
  float n1 = fbm(uv * 3.0 + vec2(t, -t * 0.6));
  float n2 = fbm(uv * 5.5 - vec2(t * 0.7, t * 0.4) + n1 * 1.4);

  float cloud = smoothstep(0.32, 0.85, n2);

  // Fade out toward the plane edges so the quad never shows.
  float edge = smoothstep(0.5, 0.18, length(uv));
  cloud *= edge;

  vec3 color = mix(uColorA, uColorB, n1);

  gl_FragColor = vec4(color, cloud * uOpacity);

  #include <colorspace_fragment>
}
