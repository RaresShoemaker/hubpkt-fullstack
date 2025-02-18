import React from 'react';
import { Link } from 'react-router-dom';

type CtaButtonProps = {
  label: string;
  href: string;
}

const CtaButton: React.FC<CtaButtonProps> = ({href, label}) => {
  return (
      <Link to={href} target='_blank'>
        <button className='rounded-full bg-primary text-white font-medium w-64 h-10 md:h-12 md:text-lg md:font-semibold' aria-label={label}>
          {label}
        </button>
      </Link>
  )
}

export default CtaButton;