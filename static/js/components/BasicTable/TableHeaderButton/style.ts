import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TableHeaderButton {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.014em;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: none;
    @include respond-to(xl) {
      font-size: $medium;
    }
    @include respond-to(sm) {
      font-size: $small;
    }
    &__small {
      @include respond-to(sm) {
        font-size: $extraSmall;
      }
    }

    span {
      font-weight: 400;
      font-size: 10px;
      line-height: 12px;
      color: rgba(255, 255, 255, 0.3);
      @include respond-to(xl) {
        font-size: $extraSmall;
      }
      @include respond-to(sm) {
        font-size: 8px;
      }
    }

    &__withSort {
      div {
        display: flex;
        flex-direction: row;
        position: relative;
        align-items: center;
        &:after {
          display: inline-block;
          content: '';
          transform: rotate(44deg);
          height: 6px;
          width: 6px;
          border-bottom: 1px solid $borderColor;
          border-right: 1px solid $borderColor;
          @include respond-to(md) {
            right: -12px;
          }
          @include respond-to(sm) {
            border-width: 5px 3px 0 3px;
            right: -8px;
          }
        }
      }
    }

    &__desk {
      p {
        &:after {
          rotate: 180deg;
          @include respond-to(sm) {
          }
        }
      }
    }

    &__withSubTitle {
      flex-direction: column-reverse;
    }
  }

  .arrowDropDown:active {
    margin-top: -10px;
  }
`;

export default staticStyles;
