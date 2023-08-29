import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TopStats {
    text-align: left;
    h3 {
      display: flex;
      align-items: center;
      font-size: $regular;
      font-weight: 600;

      @include respond-to(sm) {
        height: 25px;
      }
    }

    &__main-title {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.014em;
      color: rgba(255, 255, 255, 0.6);
    }

    &__title {
      font-weight: 600;
      font-size: 19px;
      line-height: 23px;
      color: #ffffff;
    }

    &__subText {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.01em;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 8px;
      flex: 1 1 0 !important;
    }

    &__modal-text {
      font-weight: 400;
      padding-bottom: 16px;
    }
    .TokenIcon {
      float: left;
      margin-top: 9px;
    }
  }
`;

export default staticStyles;
