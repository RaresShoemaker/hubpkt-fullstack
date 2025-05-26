/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ButtonHero from './HeroButton';
import { ButtonStyle } from './HeroButton';
import { parsePositionFromClasses } from '../../utils/designElementUtils';
import HeroGridItem from './HeroGridItem';

interface HtmlTag {
	link?: string;
	text?: string;
	type: string;
	style?: ButtonStyle;
	position: string;
	data?: {
		cta?: {
			text?: string;
			style?: ButtonStyle;
			link?: string;
			position: string;
		};
	};
}

export interface HtmlElement {
	id: string;
	designElementId: string;
	htmlTag: HtmlTag;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
}

interface HeroElementsProps {
	htmlTags: HtmlElement[];
}

// Main HeroElements component focused solely on buttons
const HeroElements: React.FC<HeroElementsProps> = ({ htmlTags }) => {

	const getElementStyle = (position: any) => {
    return {
      gridColumnStart: position.colStart,
      gridColumnEnd: position.colStart + position.colSpan,
      gridRowStart: position.rowStart,
      gridRowEnd: position.rowStart + position.rowSpan,
    };
  };

	return (
		<>
			{/* {htmlTags.map(element => renderButton(element))} */}
			{htmlTags.map((element) => {
				return (
					<HeroGridItem
						key={element.id}
						style={getElementStyle(parsePositionFromClasses(element.htmlTag.position))}
					>
						<ButtonHero
							text={element.htmlTag.text || 'Button'}
							style={element.htmlTag.style}
							style-position={getElementStyle(parsePositionFromClasses(element.htmlTag.position))}
							link={element.htmlTag.link}
							className='w-full'
						/>
					</HeroGridItem>
				);
			})}
		</>
	);
};

export default HeroElements;
