import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Film,Project} from './Film';
import template from '../templates/project.json';
const Root=()=> <Composition id="BrandFilm" component={Film} width={1080} height={1920} fps={30} durationInFrames={900} defaultProps={template as Project} calculateMetadata={({props})=>({fps:props.fps,durationInFrames:Math.round(props.duration*props.fps)})}/>;
registerRoot(Root);
