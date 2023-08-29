import React from 'react';
import { images } from './icons';

interface SystemIconInterface {
  image: string;
  size: string;
  border?: boolean;
  margin?: string;
}

const SystemIcon = (props: SystemIconInterface) => {
  const { image, size, border, margin } = props;
  const imagePath = images[image];
  return (
    <>
      <div>
        <img src={`${imagePath}`} alt={image} className="systemIcon" />
      </div>
      <style jsx>{`
        .systemIcon {
          position: relative;
          width: ${size};
          height: ${size};
          ${border
            ? `border: 1px solid rgba(255, 255, 255, 0.05);border-radius: 10px;padding: 5px;`
            : `border: none;border-radius: 0px;padding: 0;`}
          margin: ${margin};
          &__image {
            position: absolute;
            width: 100%;
            height: 100%;
            inset: 0;
            object-fit: fill;
            object-position: center;
          }
        }
      `}</style>
    </>
  );
};

export default SystemIcon;
