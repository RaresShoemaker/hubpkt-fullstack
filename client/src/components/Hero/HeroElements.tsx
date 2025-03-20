import React from 'react';
import HeroGridItem from './HeroGridItem';
import ButtonHero from './HeroButton';

// Define TypeScript interfaces for our component props
// Import the ButtonStyle type from ButtonHero
import { ButtonStyle } from './HeroButton';

interface HtmlTag {
  link?: string;
  text?: string;
  type: string;
  style?: ButtonStyle;
  position: string;
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
  const renderButton = (element: HtmlElement) => {
    const { htmlTag } = element;
    const { text, style, position, link } = htmlTag;
    
    return (
      <HeroGridItem key={element.id} gridClasses={position} align="center">
        <ButtonHero
          text={text}
          style={style}
          link={link}
        />
      </HeroGridItem>
    );
  };

  return (
    <>
      {htmlTags.map(element => renderButton(element))}
    </>
  );
};

export default HeroElements;