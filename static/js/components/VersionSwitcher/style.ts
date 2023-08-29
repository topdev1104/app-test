import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  .VersionSwitcher {
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: bold;
    height: 36px;
    background: rgba(100, 92, 192, 0.4);
    border-radius: 32px;
    padding: 8px 16px;

    &__label-left {
      margin-right: 10px;
    }
    &__label-right {
      margin-left: 10px;
    }

    &__toggle-switch input {
      opacity: 0;
    }

    &__toggle-switch label {
      width: 36px;
      height: 20px;
      background: linear-gradient(180deg, #4ca9de 0%, #4cdebb 100%);
      border-radius: 18px;
      display: inline-block;
      position: relative;
      cursor: pointer;
      color: white;
    }

    &__toggle-switch label:after {
      content: '';
      display: block;
      width: 14px;
      height: 14px;
      background: #f9f8ff;
      box-shadow: 0px 4px 5px -1px rgba(0, 0, 0, 0.08);
      border-radius: 18px;
      position: absolute;
      top: 3px;
      left: 3px;
      transition: left 0.3s ease-out;
    }

    &__toggle-switch input[id='togle-swith']:checked + label:after {
      left: 19px;
    }

    &__toggle-switch input[id='togle-swith']:checked + label {
      background: linear-gradient(180deg, #4ca9de 0%, #4cdebb 100%);
    }
  }
`;

export default staticStyles;
