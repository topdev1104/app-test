import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .InputBar {
    margin: 10px 0;
    width: 100%;
    position: relative;

    &__top-inner {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      margin-bottom: 2px;
      min-height: 16px;
    }

    &__label {
      display: flex;
      align-items: center;
      p,
      .Value .Value__value {
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        text-align: right;
        color: #ffffff;
      }
      .Value {
        margin-left: 5px;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        text-align: right;
        color: #ffffff;
      }
    }

    &__container {
      &__title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        font-weight: 400;
        font-size: 10px;
        line-height: 12px;
        color: #ffffff;
      }
    }

    &__range-inner {
      margin-top: 7px;
      width: 100%;
      border-radius: 10px;
      background: linear-gradient(90.01deg, #a49fda 0.01%, #221a7e 99.99%);
    }

    .InputBar__track {
      height: 14px;
      width: calc(100% - 14px);
      margin: 0 auto;
      border-radius: 10px;
    }

    .InputBar__thumb {
      width: 28px;
      height: 28px;
      border-radius: 28px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3);
      outline: none !important;
    }
  }
`;

export default staticStyles;
