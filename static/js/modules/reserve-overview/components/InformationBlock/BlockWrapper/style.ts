import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .BlockWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 179px;
    height: 100px;
    padding: 16px;
    background: linear-gradient(
      108.66deg,
      rgba(160, 175, 255, 0.02) 0.33%,
      rgba(182, 255, 237, 0.02) 99.67%
    );
    backdrop-filter: blur(2px);
    border-radius: 16px;
    @include respond-to(sm) {
      margin-bottom: 30px;
      &:last-of-type {
        margin-bottom: 0;
      }

      &__content {
        margin-top: 5px;
      }
    }

    &__title-inner {
      .TextWithModal__text,
      p {
        margin-bottom: 4px;
        font-weight: 400;
        font-size: 14px;
        @include respond-to(xl) {
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

      .TextWithModal__button {
        @include respond-to(xl) {
          right: -14px !important;
        }
        @include respond-to(lg) {
          right: -12px !important;
        }
        @include respond-to(md) {
          right: -14px !important;
        }
        @include respond-to(sm) {
          right: -16px !important;
          display: none;
        }
      }

      .TextWithModal__button img {
        @include respond-to(xl) {
          width: 10px !important;
          height: 10px !important;
        }
        @include respond-to(lg) {
          width: 8px !important;
          height: 8px !important;
        }
        @include respond-to(md) {
          width: 10px !important;
          height: 10px !important;
        }
        @include respond-to(sm) {
          width: 12px !important;
          height: 12px !important;
        }
      }
    }
  }
`;

export default staticStyles;
