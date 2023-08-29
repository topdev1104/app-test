import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/_vars';
  @import 'src/_mixins/_screen-size';

  .MarketCirculatingSupply {
    color: white;
    height: 162px;
    padding-left: 24px;
    padding-top: 17px;
    padding-bottom: 17px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @include respond-to(xs) {
      align-items: center;
    }

    @include respond-to(sm) {
      align-items: center;
    }

    &__title {
      font-family: 'Inter';
      font-weight: 400;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      @include respond-to(sm) {
        font-size: 11px;
        text-align: center;
      }
    }

    &__size {
      font-weight: 600;
      font-size: 23px;
      line-height: 28px;
      @include respond-to(sm) {
        font-size: 12px;
        text-align: center;
      }
    }

    &__value {
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
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
    }
  }
`;

export default staticStyles;
