import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

export const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none  " style={{ filter: "blur(15px)" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false }, 
          particles: {
            number: {
              value: 2,
              density: {
                enable: true,
                value_area: 600,
              },
            },
            color: {
              value: [
                "#5a68e9",
                "#7a3fdc",
                "#3b0b91",
                "#241e92",
                "#6e44ff",
                "#240046",
                "#4834d4",
              ],
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.5,
              random: true,
            },
            size: {
              value: { min: 60, max: 100 },
              random: true,
              animation: {
                enable: true,
                speed: 3,
                minimumValue: 1,
                sync: false,
              },
            },
            move: {
              enable: true,
              speed: 2,
              direction: "top",
              straight: true,
              outModes: { default: "out" },
            },
          },
          emitters: {
            direction: "top",
            position: { x: 50, y: 100 },
            rate: { delay: 2, quantity: 1 },
            size: { width: 100, height: 0 },
          },
          background: { color: { value: "transparent" } },
          detectRetina: true,
        }}
      />
    </div>
  );
};
