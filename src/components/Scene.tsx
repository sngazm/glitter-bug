import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Mask, useMask } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Mesh } from "three";
import { useRef } from "react";

const Sphere = () => {
  const meshRef = useRef<Mesh>(null);
  // const clippingPlane = new Plane()
  // clippingPlane.setFromNormalAndCoplanarPoint(
  //   new Vector3(1, 0, 0), // 法線ベクトル (X軸に垂直)
  //   new Vector3(0, 0, 0)  // 平面上の点
  // )

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5; // ゆっくり回転（0.5は回転速度）
    }
  });

  const stencil = useMask(1, true);

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial
        color="#ddffff"
        emissive="#ffffff"
        emissiveIntensity={0.5}
        // clippingPlanes={[clippingPlane]}
        // clipShadows={true}
        {...stencil}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: "100vw", height: "100vh", background: "#000000" }}
      gl={{ localClippingEnabled: true, stencil: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        args={[10, 10]}
        cellSize={1}
        cellThickness={1}
        cellColor="#6f6f6f"
        sectionSize={3.3}
        sectionThickness={1.5}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      <Mask id={1} position={[1, 0, 1]}>
        <circleGeometry args={[0.8, 64]} />
        <meshBasicMaterial color="#ff0000" />
      </Mask>
      <Sphere />
      <OrbitControls enableDamping dampingFactor={0.05} />
      <EffectComposer stencilBuffer>
        <Bloom
          intensity={1.0}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;
