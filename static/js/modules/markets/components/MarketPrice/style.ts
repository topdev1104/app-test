import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/_vars';
  @import 'src/_mixins/_screen-size';

  .MarketPrice {
    width: 19%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__title {
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }

    &__price {
      font-weight: 600;
      font-size: 19px;
      line-height: 23px;
      color: #ffffff;
    }

    &__button button {
      color: white;
      border: 1px solid #8079cb;
      border-radius: 8px;
      background: rgba(100, 92, 192, 0.4);
      width: 102px;
      height: 36px;
      font-weight: 600;
      font-size: 14px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
`;

export default staticStyles;
