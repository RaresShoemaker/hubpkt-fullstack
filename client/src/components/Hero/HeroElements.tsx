import React from 'react';
import ButtonHero from './HeroButton';
import { ButtonStyle } from './HeroButton';

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
	// const renderButton = (element: HtmlElement) => {
	//   const { htmlTag } = element;

	//   // Handle direct button elements
	//   if (htmlTag.type === 'button') {
	//     const { text, style, position, link } = htmlTag;

	//     return (
	//       <div key={element.id} className={position + " flex items-center justify-center"}>
	//         <ButtonHero
	//           text={text || 'Button'}
	//           style={style || 'secondary'}
	//           link={link}
	//           className="w-full"
	//         />
	//       </div>
	//     );
	//   }

	//   // Handle nested CTA structure if it exists
	//   if (htmlTag.data?.cta) {
	//     const { text, style, position, link } = htmlTag.data.cta;

	//     return (
	//       <div key={element.id} className={position + " flex items-center justify-center"}>
	//         <ButtonHero
	//           text={text || 'Button'}
	//           style={style || 'secondary'}
	//           link={link}
	//           className="w-full"
	//         />
	//       </div>
	//     );
	//   }

	//   return null;
	// };

	return (
		<>
			{/* {htmlTags.map(element => renderButton(element))} */}
			{htmlTags.map((element) => {
				return (
					<div key={element.id} className={element.htmlTag.position + ' flex items-center justify-center'}>
						<ButtonHero
							text={element.htmlTag.text || 'Button'}
							style={element.htmlTag.style || 'secondary'}
							link={element.htmlTag.link}
							className='w-full'
						/>
					</div>
				);
			})}
		</>
	);
};

export default HeroElements;
