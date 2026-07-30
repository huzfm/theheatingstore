import * as THREE from 'three';

/**
 * A part-unrolled heating mat: a flat flap running into a spiral roll.
 *
 * This is how the product is photographed - the hero shot on p.40 of
 * public/PDFs/prowarm.pdf, and the same composition on the box art - and the
 * reason is that it says three things at once that a flat swatch cannot: the
 * mat is a *roll*, it is 500 mm wide, and it is a continuous length rather than
 * a tile. It also gives the cable somewhere to disappear to, which is what
 * makes the run read as long rather than as a repeating pattern.
 *
 * The whole thing is one coordinate transform. Sheet coordinates are
 * (u, h, z): u is arc length from the free end of the flap, h is height above
 * the sheet's own face, and z runs across the 500 mm width. Everything that
 * lives on the mat - the scrim, the cable path, the reinforcement tape - is
 * laid out flat and then pushed through map() below, so nothing has to know
 * that it is being wound up.
 */
export function createRoll({ width, length, flat, core, thickness, tangentX = null }) {
  const wrap = length - flat;

  /**
   * Outer radius.
   *
   * A spiral of pitch `thickness` winding from `outer` in to `core` holds
   * (outer² - core²)·π / thickness of sheet. Inverting that is what makes the
   * roll exactly as fat as the length of mat wound onto it, so its size is a
   * consequence of the product rather than a number picked because it looked
   * about right - and it stays correct if the length is ever changed.
   */
  const outer = Math.sqrt(core * core + (thickness * wrap) / Math.PI);

  /** Radius lost per radian of winding. */
  const K = thickness / (2 * Math.PI);

  // Centred on the origin by default, so the product turns about its own middle
  // rather than swinging around an axis off to one side.
  const tx = tangentX ?? (flat - outer) / 2;
  const cy = -outer;

  /**
   * Arc length to winding angle.
   *
   * s(θ) = ∫r dθ = outer·θ - Kθ²/2, so θ is the smaller root of
   * (K/2)θ² - outer·θ + s = 0. The discriminant is clamped because floating
   * point can put it a hair under zero at exactly the core.
   */
  const angleAt = (s) =>
    (outer - Math.sqrt(Math.max(0, outer * outer - 2 * K * s))) / K;

  /**
   * Sheet coordinates to world.
   *
   * The sheet is tangent to the *top* of the roll, not the bottom. That is the
   * one non-obvious choice here and it is what puts the cable on the outside of
   * the wind, which is what the product photo shows: tangency at the bottom
   * would wind the cable face inward and leave the roll showing nothing but the
   * back of the mesh.
   */
  function map(u, h, z) {
    if (u <= flat) return new THREE.Vector3(tx - (flat - u), h, z);

    const theta = angleAt(u - flat);
    const r = outer - K * theta;
    const phi = Math.PI / 2 - theta;

    return new THREE.Vector3(
      tx + (r + h) * Math.cos(phi),
      cy + (r + h) * Math.sin(phi),
      z
    );
  }

  /**
   * Outward face normal at `u`. Supplied explicitly rather than left to
   * computeVertexNormals, which would average across the tangent line and put
   * a soft crease where the flap meets the roll - the one place the surface is
   * genuinely meant to change direction sharply.
   */
  function normal(u) {
    if (u <= flat) return new THREE.Vector3(0, 1, 0);
    const phi = Math.PI / 2 - angleAt(u - flat);
    return new THREE.Vector3(Math.cos(phi), Math.sin(phi), 0);
  }

  return {
    width,
    length,
    flat,
    wrap,
    core,
    thickness,
    outer,
    tangentX: tx,
    centreY: cy,
    /** World x of the flap's free end, where the cold lead leaves. */
    freeEdgeX: tx - flat,
    map,
    normal,
  };
}

/**
 * A strip of the sheet, as geometry: the scrim itself, or one run of tape.
 *
 * Two vertices per step is enough because the sheet is dead straight across its
 * width - all the curvature is along u. Segment count is spent uniformly in arc
 * length, which means the tight inner turns get *more* angular resolution than
 * the outer ones, i.e. exactly where it is needed.
 *
 * UVs carry world arc length rather than a 0-1 range. A material then only has
 * to say how big one tile is (repeat = 1/tile) and the weave holds a constant
 * physical size across the flap and around every turn, with no per-strip
 * bookkeeping and nothing to stretch at the tangent.
 */
export function rolledStrip(roll, { z = 0, width, lift = 0, segments = 480 } = {}) {
  const count = segments + 1;
  const positions = new Float32Array(count * 2 * 3);
  const normals = new Float32Array(count * 2 * 3);
  const uvs = new Float32Array(count * 2 * 2);
  const indices = [];

  const edges = [z - width / 2, z + width / 2];

  for (let i = 0; i < count; i += 1) {
    const u = (i / segments) * roll.length;
    const n = roll.normal(u);

    for (let j = 0; j < 2; j += 1) {
      const p = roll.map(u, lift, edges[j]);
      const k = (i * 2 + j) * 3;
      positions[k] = p.x;
      positions[k + 1] = p.y;
      positions[k + 2] = p.z;
      normals[k] = n.x;
      normals[k + 1] = n.y;
      normals[k + 2] = n.z;

      const t = (i * 2 + j) * 2;
      uvs[t] = u;
      uvs[t + 1] = j === 0 ? 0 : width;
    }
  }

  // Wound so the front face is the one the normal points out of.
  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}
