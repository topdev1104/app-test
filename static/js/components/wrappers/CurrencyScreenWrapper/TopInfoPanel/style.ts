import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TopInfoPanel {
    display: flex;
    margin-bottom: 5px;
    align-items: flex-start;
    @include respond-to(sm) {
      margin: 0;
      flex-wrap: wrap;
      padding: 5px 10px;
      justify-content: center;
    }

    .TopInfoPanel__line {
      margin-right: 30px;
      align-items: center;
      @include respond-to(sm) {
        margin-right: 0;
        min-width: 50%;
        max-width: 80%;
        padding: 10px;
        .Row__title-inner {
          align-items: center;
        }
        .Value,
        .ValuePercent {
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 400;
        }
      }
    }

    .Value__value,
    .ValuePercent__value {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.01em;
      color: #ffffff;
    }

    .Row__title-inner,
    .Row__title,
    .Row__title,
    .Value,
    .ValuePercent,
    .TextWithModal__text,
    .TopInfoPanel__no-data,
    .TopInfoPanel__healthFactor .TextWithModal__text {
      margin: 0;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      // @include respond-to(xl) {
      //   font-size: $small;
      // }
      // @include respond-to(lg) {
      //   font-size: $extraSmall;
      // }
      // @include respond-to(sm) {
      //   font-size: $medium;
      // }
    }
    .Row__title-inner .Row__title .Row__title,
    .TextWithModal__text,
    .TopInfoPanel__healthFactor .TextWithModal__text {
      @include respond-to(sm) {
        font-size: $small;
        padding-right: 0;
      }
    }

    .TopInfoPanel__healthFactor {
      @include respond-to(sm) {
        margin-right: 0;
        width: 50%;
        padding: 10px;
        display: block;
        text-align: center;
        .ValuePercent {
          align-items: center;
          justify-content: center;
        }
      }
    }
    .HealthFactor__percent {
      margin-left: 25px;
      @include respond-to(sm) {
        margin-left: 0;
      }
    }
  }
`;

export default staticStyles;
