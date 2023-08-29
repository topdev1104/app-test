import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/_vars';
  @import 'src/_mixins/_screen-size';

  .MarketLock {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.014em;
    color: rgba(255, 255, 255, 0.8);

    &__values {
      display: flex;
      flex-direction: row;
      align-items: center;

      &__icon {
        margin-right: 10px;
      }
    }
    &__title {
      font-weight: 400;
      font-size: 16px;
      margin-bottom: 6px;
    }

    &__size {
      font-size: 19px;
      line-height: 23px;
      color: #ffffff;
      font-weight: 600;
    }

    &__value {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: rgba(255, 255, 255, 0.6);
    }

    &__button a {
      color: white;
      border: 1px solid #8079cb;
      border-radius: 8px;
      background: rgba(100, 92, 192, 0.4);
      width: 102px;
      height: 36px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
`;

export default staticStyles;
