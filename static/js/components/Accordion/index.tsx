import React, { useState } from 'react';
import SystemIcon from '../SystemIcon/SystemIcon';

type AccordionProps = {
  title: string;
  open?: boolean;
  toggleable?: boolean;
  displayArrowIcon?: boolean;
  children: React.ReactNode;
};

const Accordion: React.FC<AccordionProps> = (props: AccordionProps) => {
  const {
    title,
    displayArrowIcon = true,
    children,
    open = false,
    toggleable = true,
  }: AccordionProps = props;
  const [isOpen, setIsOpen] = useState<boolean>(open);

  const handleClick = (e: any) => {
    e.preventDefault();
    toggleable && setIsOpen(!isOpen);
  };

  return (
    <div onClick={(e) => handleClick(e)} className="Accordion__container">
      <div className="Accardion__header">
        <h3 className="Accordion__title">
          <div style={{ marginRight: 8 }}>
            <SystemIcon image="calendar" size="16" />
          </div>
          {title}
        </h3>
        {displayArrowIcon && toggleable && <SystemIcon image="arrowDropDown" size="16" />}
      </div>
      {isOpen && children && <div>{children}</div>}
      <style jsx={true} global={true}>{`
        .Accordion__container {
          cursor: pointer;
          padding: 23px 28px 23px 16px;
          background: rgba(57, 48, 159, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }

        .Accardion__header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }

        .Accordion__title {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-content: center;
          align-items: center;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          letter-spacing: 0.014em;
          color: rgba(255, 255, 255, 0.6);
        }

        .checkmark {
          display: inline-block;
          content: '';
          -webkit-transform: rotate(44deg);
          -ms-transform: rotate(44deg);
          transform: rotate(44deg);
          height: 8px;
          width: 8px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.6);
          border-right: 2px solid rgba(255, 255, 255, 0.6);
          margin-left: 5px;

          &:after {
            transform: rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Accordion;
