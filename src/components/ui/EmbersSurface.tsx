import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type EmbersProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function EmbersSurface({ className, ...props }: EmbersProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Particles Data
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    
    // Colors for fire/embers (Red, Orange, Gold)
    const fireColors = [
      new THREE.Color(0xd91c1c), // Blood red
      new THREE.Color(0xff4500), // Orange red
      new THREE.Color(0xff8c00), // Dark orange
      new THREE.Color(0xffd700)  // Gold
    ];

    for (let i = 0; i < particleCount; i++) {
      // Random positions spread across a wide frustum
      positions[i * 3] = (Math.random() - 0.5) * 400; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z

      const color = fireColors[Math.floor(Math.random() * fireColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2.0 + 0.5;
      phases[i] = Math.random() * Math.PI * 2; // For twirly organic motion
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    // Custom Shader Material for Glowing Embers
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        attribute float phase;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Organic drift upwards and wavy sideways motion
          float verticalSpeed = 20.0;
          float timeMod = time + phase;
          
          pos.y += time * verticalSpeed;
          pos.x += sin(timeMod * 0.5) * 15.0;
          pos.z += cos(timeMod * 0.3) * 10.0;
          
          // Loop around if it goes too high (simulating a bounding box of 400 height)
          pos.y = mod(pos.y + 200.0, 400.0) - 200.0;
          
          // Fade in/out based on Y position (fade at top and bottom)
          float normalizedY = (pos.y + 200.0) / 400.0; // 0 to 1
          vAlpha = sin(normalizedY * 3.14159) * 0.8; // 0 at ends, 0.8 at center

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size attenuation based on distance
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Circular particle with soft glowing edge
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if(ll > 0.5) discard;
          
          float glow = 1.0 - (ll * 2.0);
          glow = pow(glow, 1.5); // sharpen the core
          
          gl_FragColor = vec4(vColor, vAlpha * glow);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.1;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const t = clock.getElapsedTime();
      material.uniforms.time.value = t;

      // Smooth camera pan based on mouse
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
      
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (-targetY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
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
