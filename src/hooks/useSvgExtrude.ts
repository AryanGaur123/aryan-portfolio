import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';

/**
 * SVGLoader → ExtrudeGeometry pipeline.
 * - useLoader caches the parsed SVG globally by URL, so remounting a lazy
 *   logo canvas never re-fetches/re-parses.
 * - The geometry is normalized: centered, max dimension = 1 world unit,
 *   and rotated to fix SVG's y-down coordinate space (rotation, not a
 *   negative scale, so face winding/normals stay correct).
 *
 * @param url        SVG asset URL
 * @param depthRatio extrusion depth as a fraction of the shape's larger XY dimension
 */
export function useSvgExtrude(url: string, depthRatio = 0.1): THREE.ExtrudeGeometry {
  const svg = useLoader(SVGLoader, url);

  return useMemo(() => {
    const shapes = svg.paths.flatMap(path => SVGLoader.createShapes(path));

    // Measure the flat footprint first so bevel/depth scale with the artwork.
    const probe = new THREE.ShapeGeometry(shapes);
    probe.computeBoundingBox();
    const flat = new THREE.Vector3();
    probe.boundingBox!.getSize(flat);
    probe.dispose();
    const major = Math.max(flat.x, flat.y);

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: major * depthRatio,
      bevelEnabled: true,
      bevelThickness: major * 0.012,
      bevelSize: major * 0.01,
      bevelSegments: 3,
      curveSegments: 10,
    });

    geo.center();
    geo.rotateX(Math.PI); // SVG y-axis points down

    geo.computeBoundingBox();
    const size = new THREE.Vector3();
    geo.boundingBox!.getSize(size);
    const s = 1 / Math.max(size.x, size.y, size.z);
    geo.scale(s, s, s);
    geo.computeBoundingSphere();

    return geo;
  }, [svg, depthRatio]);
}
