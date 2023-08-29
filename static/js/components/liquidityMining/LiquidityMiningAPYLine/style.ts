import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/screen-size';
  @import 'src/_mixins/vars';

  .LiquidityMiningAPYLine {
    position: relative;
    padding: 4px 8px;
    margin-top: 3px;
    //border-radius: $borderRadius;
    border: 1px solid #8079cb66;
    border-radius: 8px;
    background: linear-gradient(
      0deg,
      rgba(49, 40, 147, 0.2) 0%,
      rgba(33, 25, 121, 0.4) 49.48%,
      rgba(49, 40, 147, 0.2) 100%,
      rgba(49, 40, 147, 0.2) 100%
    );
    opacity: 0.8;

    display: flex;
    align-items: center;
    justify-content: center;
    &.noBorder {
      border: none;
      box-shadow: none;
    }
    @include respond-to(xl) {
      margin-top: 3px;
      padding: 1px 5px;
    }

    &__withTooltip {
      cursor: pointer;
    }

    &__tribe {
      display: flex;
      align-items: center;
      justify-content: center;
      strong {
        margin: 0 3px;
        @include respond-to(lg) {
          position: relative;
          top: 1px;
        }
        @include respond-to(md) {
          top: 0;
        }
      }
      img {
        width: 12px;
        height: 12px;
        position: relative;
        @include respond-to(xl) {
          width: 10px;
          height: 10px;
        }
      }
    }

    .ValuePercent .ValuePercent__value,
    &__title {
      font-size: 12px;
      color: #fff;
    }

    .ValuePercent {
      margin: 0 3px;
    }

    .TokenIcon {
      &__image {
        margin-right: 0;
      }
    }

    .LiquidityMiningAPYLine__tooltip {
      max-width: 550px;
      display: block;
      padding: 7px 10px;
      border-radius: $borderRadius;
      box-shadow: $boxShadow;
      @include respond-to(xl) {
        max-width: 380px;
      }
    }

    &__tooltip--content {
      font-size: $medium;
      @include respond-to(xl) {
        font-size: $extraSmall;
      }
    }
  }
`;

export default staticStyles;
