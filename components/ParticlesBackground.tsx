'use client';

import { useCallback, useMemo, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

export default function ParticlesBackground() {
  const [ready, setReady] = useState(false);

  const particlesLoaded = useCallback(async () => {
    setReady(true);
  }, []);

  const options: ISourceOptions = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab',
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.35,
            color: '#B8E351',
          },
        },
        push: {
          quantity: 2,
        },
      },
    },
    particles: {
      color: {
        value: ['#B8E351', '#7EAA1B', '#23430C'],
      },
      links: {
        color: '#B8E351',
        distance: 130,
        enable: true,
        opacity: 0.12,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: 'none' as const,
        outModes: {
          default: 'bounce' as const,
        },
      },
      number: {
        value: 60,
        density: {
          enable: true,
        },
      },
      opacity: {
        value: { min: 0.15, max: 0.5 },
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }), []);

  return (
    <div className="absolute inset-0 z-0">
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        className="w-full h-full"
      />
    </div>
  );
}
