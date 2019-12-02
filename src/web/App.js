import React, { useRef } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from 'react-three-fiber';

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

function Thing() {
	const ref = useRef();
	useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01));
	return (
		<mesh ref={ref} onClick={e => console.log('click')} onPointerOver={e => console.log('hover')} onPointerOut={e => console.log('unhover')}>
			<boxBufferGeometry attach="geometry" args={[2, 2, 0.2]} />
			<meshNormalMaterial attach="material" />
		</mesh>
	);
}

export default function App() {
	return (
		<div>
			<h1>Rendered!</h1>
			<CanvasWrapper>
				<Canvas>
					<Thing />
				</Canvas>
			</CanvasWrapper>
		</div>
	);
}
