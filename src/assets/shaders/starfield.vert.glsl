uniform float uTime;
uniform float uSize;

attribute float aScale;

varying vec3 vColor;

void main() {
  vec3 pos = position;

  // Differential rotation — inner stars orbit faster than outer ones,
  // which keeps the spiral arms slowly winding forever.
  float distanceToCenter = length(pos.xz);
  float angle = atan(pos.x, pos.z);
  float angleOffset = (1.0 / max(distanceToCenter, 0.25)) * uTime * 0.045;
  angle += angleOffset;
  pos.x = sin(angle) * distanceToCenter;
  pos.z = cos(angle) * distanceToCenter;

  // Gentle vertical breathing so the disc never reads as a static plane.
  pos.y += sin(uTime * 0.3 + distanceToCenter * 2.0) * 0.02;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vColor = color;
}
