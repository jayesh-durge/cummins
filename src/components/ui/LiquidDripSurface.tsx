import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type LiquidProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function LiquidDripSurface({ className, ...props }: LiquidProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    containerRef.current.appendChild(renderer.domElement);

    // Full screen quad geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Shader Material for liquid drips
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
            vec2 uv = vUv;
            // Increased the global time speed for active flow
            float time = uTime * 0.9; 
            
            vec2 aspectUv = uv;
            aspectUv.x *= uResolution.x / uResolution.y;

            // Calculate X-axis wobble using Y axis and time so it snakes back and forth
            float wobbleX = snoise(vec2(aspectUv.y * 1.5, time * 0.4)) * 0.8;

            // Generate two overlapping downward scrolling noise layers
            // Subtracting 'time' from Y ensures the texture translates perfectly downward
            float flow1 = snoise(vec2(aspectUv.x * 5.0 + wobbleX, aspectUv.y * 4.0 - time * 1.2));
            float flow2 = snoise(vec2(aspectUv.x * 12.0 - wobbleX * 0.5, aspectUv.y * 8.0 - time * 1.8));

            // Calculate distance from top to lock blood mass near the ceiling
            float distFromTop = 1.0 - uv.y; // 0 at top, 1 at bottom
            
            // Generate a weight that guarantees blood at top and restricts it from filling bottom
            float topWeight = (1.0 - smoothstep(0.05, 0.8, distFromTop)) * 1.3;

            // Merge everything into a composite fluid heightmap
            float fluidMap = topWeight + (flow1 * 0.5) + (flow2 * 0.3) + 0.1;

            // Threshold the heightmap to create absolute borders
            float edge = fluidMap - 0.5; 
            
            // Apply anti-aliasing to liquid border
            float alpha = smoothstep(0.0, 0.05, edge);

            // Create a specular shiny neon rim right at the border edge
            float specular = smoothstep(0.0, 0.08, edge) * smoothstep(0.2, 0.02, edge);

            vec3 baseBlood = vec3(0.5, 0.0, 0.0); // True Crimson
            vec3 neonBlood = vec3(1.0, 0.1, 0.1); // Cyberpunk wet reflection
            
            vec3 color = mix(baseBlood, neonBlood, specular * 1.2);

            gl_FragColor = vec4(color, alpha * 0.9); // Slight master transparency
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden'
      }}
      className={className}
      {...props}
    />
  );
}
