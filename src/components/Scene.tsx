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
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  const stencil = useMask(1, true);

  // シェーダーマテリアルの定義
  const vertexShader = `
    varying vec3 vWorldPosition;
    
    void main() {
      // ワールド空間での位置を計算
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vWorldPosition;
    
    void main() {
      // ワールド空間でのX座標に基づいて色を変化させる
      float r = smoothstep(-2.0, 2.0, vWorldPosition.x);
      float g = 0.5;
      float b = 1.0 - smoothstep(-2.0, 2.0, vWorldPosition.x);
      float a = smoothstep(-2.0, 2.0, vWorldPosition.x);
      
      gl_FragColor = vec4(r, g, b, a);
    }
  `;

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
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
      {/* <EffectComposer stencilBuffer>
        <Bloom
          intensity={1.0}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
        />
      </EffectComposer> */}
    </Canvas>
  );
};

export default Scene;
