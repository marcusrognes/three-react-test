import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon';
import styled from 'styled-components';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { useDrag, useHover } from 'react-use-gesture';

import { usePhysics, Provider as PhsyicsProvider } from 'web/hooks/usePhysics';

const CanvasWrapper = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	height: 100vh;
	width: 100vw;
	canvas {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
`;

function Floor({ position }) {
	const ref = usePhysics({ mass: 0 }, body => {
		body.addShape(new CANNON.Plane());
		body.position.set(...position);
	});

	return (
		<mesh ref={ref} receiveShadow>
			<planeBufferGeometry attach="geometry" args={[1000, 1000]} />
			<meshPhongMaterial attach="material" color="#272727" />
		</mesh>
	);
}

function Box({ position }) {
	// Register box as a physics body with mass
	const { size, viewport } = useThree();
	const aspect = size.width / viewport.width;
	const [isDragging, setIsDragging] = useState(false);

	const ref = usePhysics({ mass: 100000 }, body => {
		body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));
		body.position.set(...position);
	});

	useFrame(() => {
		if (isDragging) {
			console.log('Is Dragging!');
		}
	});

	return (
		<mesh
			ref={ref}
			castShadow
			receiveShadow
			onPointerDown={props => {
				setIsDragging(true);
			}}
			onPointerUp={props => {
				setIsDragging(false);
			}}>
			<boxGeometry attach="geometry" args={[2, 2, 2]} />
			<meshStandardMaterial attach="material" />
		</mesh>
	);
}

export default function App() {
	return (
		<div>
			<h1>Rendered!</h1>
			<CanvasWrapper>
				<Canvas camera={{ position: [0, 0, 15] }} onCreated={({ gl }) => ((gl.shadowMap.enabled = true), (gl.shadowMap.type = THREE.PCFSoftShadowMap))}>
					<ambientLight intensity={0.5} />
					<spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
					<PhsyicsProvider>
						<Floor position={[0, 0, -10]} />
						<Box position={[1, 0, 1]} />
						<Box position={[2, 1, 5]} />
						<Box position={[0, 0, 6]} />
						<Box position={[-1, 1, 8]} />
						<Box position={[-2, 2, 13]} />
						<Box position={[2, -1, 13]} />
					</PhsyicsProvider>
				</Canvas>
			</CanvasWrapper>
		</div>
	);
}
