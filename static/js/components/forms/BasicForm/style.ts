import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .Caption {
    &__primary h2 {
      font-weight: 600;
      font-size: 23px;
      line-height: 28px;
      text-align: center;
      letter-spacing: -0.02em;
    }
  }

  .BasicForm {
    margin: 0 auto;

    &__deposit-block {
      display: flex;
      flex-direction: column;
      background: rgba(57, 48, 159, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 16px;
      margin-top: 16px;

      &__column {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      &__column:nth-child(2) {
        margin-top: 16px;
      }

      &__column-value {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
      }

      &__column-collateral {
        color: #3ae47c;
      }
    }

    &__warning {
      max-width: 430px;
      margin: 0 auto;
      text-align: center;
      font-size: $medium;
      @include respond-to(xl) {
        max-width: 335px;
        font-size: $small;
      }
      @include respond-to(lg) {
        font-size: $extraSmall;
      }
      @include respond-to(md) {
        font-size: $small;
      }
      @include respond-to(sm) {
        font-size: $medium;
      }
    }

    &__buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 50px;
      @include respond-to(sm) {
        margin-bottom: 50px;
      }
    }
  }
`;

export default staticStyles;
