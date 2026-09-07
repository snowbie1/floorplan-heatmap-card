/**
 * Prüft die Darstellungsgeometrie von Türen.
 *
 * Türscharnier und Schwenkrichtung beeinflussen nur die Darstellung,
 * nicht die thermische Berechnung.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { doorGeometry } from '../src/renderer.js';

const close = (actual, expected, eps = 1e-6) =>
  assert.ok(
    Math.abs(actual - expected) < eps,
    `${actual} ≉ ${expected}`
  );

const point = (actual, x, y) => {
  close(actual.x, x);
  close(actual.y, y);
};

const DOOR = {
  x: 100,
  y: 100,
  angle: 0,
  width: 80,
  type: 'door',
};

test('Tür mit Scharnier am Anfang und negativer Schwenkrichtung', () => {
  const door = doorGeometry({
    ...DOOR,
    hinge: 'start',
    swing: -1,
  });

  point(door.hinge, 60, 100);
  point(door.closed, 140, 100);
  point(door.open, 60, 20);

  assert.equal(door.hingeMode, 'start');
  assert.equal(door.swing, -1);
  assert.equal(door.hasHinge, true);
});

test('Tür mit Scharnier am Anfang und positiver Schwenkrichtung', () => {
  const door = doorGeometry({
    ...DOOR,
    hinge: 'start',
    swing: 1,
  });

  point(door.hinge, 60, 100);
  point(door.closed, 140, 100);
  point(door.open, 60, 180);

  assert.equal(door.hingeMode, 'start');
  assert.equal(door.swing, 1);
  assert.equal(door.hasHinge, true);
});

test('Tür mit Scharnier am Ende und negativer Schwenkrichtung', () => {
  const door = doorGeometry({
    ...DOOR,
    hinge: 'end',
    swing: -1,
  });

  point(door.hinge, 140, 100);
  point(door.closed, 60, 100);
  point(door.open, 140, 180);

  assert.equal(door.hingeMode, 'end');
  assert.equal(door.swing, -1);
  assert.equal(door.hasHinge, true);
});

test('Tür mit Scharnier am Ende und positiver Schwenkrichtung', () => {
  const door = doorGeometry({
    ...DOOR,
    hinge: 'end',
    swing: 1,
  });

  point(door.hinge, 140, 100);
  point(door.closed, 60, 100);
  point(door.open, 140, 20);

  assert.equal(door.hingeMode, 'end');
  assert.equal(door.swing, 1);
  assert.equal(door.hasHinge, true);
});

test('Scharnier none ergibt eine Schiebe- oder Taschentür ohne Schwenkbogen', () => {
  const door = doorGeometry({
    ...DOOR,
    hinge: 'none',
    swing: -1,
  });

  point(door.start, 60, 100);
  point(door.end, 140, 100);

  assert.equal(door.hingeMode, 'none');
  assert.equal(door.hasHinge, false);
});