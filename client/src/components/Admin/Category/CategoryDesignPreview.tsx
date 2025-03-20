import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { useCategoryDesigns } from '../../../store/features/categoryDesigns/useCategoryDesigns';
import ButtonBase from '../Buttons/ButtonBase';
import HeroImage from '../../Hero/HeroImage';
import HeroContainer from '../../Hero/HeroContainer';
import HeroGridItem from '../../Hero/HeroGridItem';

const CategoryDesignPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { currentDesign, fetchDesignElementById } = useCategoryDesigns();

  useEffect(() => {
    if (id) {
      // Fetch the design element if not already loaded
      fetchDesignElementById(id);
    }
  }, [id, fetchDesignElementById]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!currentDesign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
          isDark ? 'border-dark-text-accent' : 'border-light-text-accent'
        }`}></div>
      </div>
    );
  }

  // Parse HTML elements if they exist
  const renderHtmlElements = () => {
    if (!currentDesign.htmlElements || currentDesign.htmlElements.length === 0) {
      return null;
    }

    return currentDesign.htmlElements.map((element, index) => {
      const htmlTag = element.htmlTag;
      
      // Check if it's a CTA button
      if (htmlTag.type === 'button' || (htmlTag.data && htmlTag.data.cta)) {
        const cta = htmlTag.data?.cta || htmlTag;
        const position = cta.position || 'col-start-4 col-span-6 row-start-4 row-span-2';
        
        return (
          <HeroGridItem
            key={index}
            gridClasses={position}
            align="center"
            justify="center"
          >
            <button className={`
              bg-transparent border-2 border-white text-white 
              font-bold py-3 px-6 rounded-full hover:bg-white 
              hover:text-purple-600 transition duration-300 w-full
            `}>
              {cta.text || 'Learn More'}
            </button>
          </HeroGridItem>
        );
      }
      
      return null;
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <ButtonBase
          onClick={handleBack}
          leftIcon={<ArrowLeft size={20} />}
          variant="secondary"
        >
          Back
        </ButtonBase>
      </div>

      <HeroContainer
        columns={12}
        rows={6}
        fullHeight={true}
        gapX={16}
        gapY={12}
        padding={{ x: 16, y: 16 }}
        gridClassName="p-4 md:p-8 lg:p-12"
        background={
          <div className="relative h-full w-full">
            {/* Background image */}
            <HeroImage src={currentDesign.image} alt="Design Preview" overlay={true} overlayOpacity={30} />
            
            {/* Background gradient if specified */}
            {currentDesign.backgroundGradient && (
              <div 
                className="absolute inset-0"
                style={{ background: currentDesign.backgroundGradient }}
              />
            )}
            
            {/* Transition gradient if specified */}
            {currentDesign.transitionGradient && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-1/4 w-full"
                style={{ background: currentDesign.transitionGradient }}
              />
            )}
          </div>
        }
      >
        {/* Render HTML elements */}
        {renderHtmlElements()}
      </HeroContainer>
    </div>
  );
};

export default CategoryDesignPreview;