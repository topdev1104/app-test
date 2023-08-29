import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TextWithTooltip {
    .title {
      display: flex;
      align-items: flex-start;
      font-size: 12px;

      img {
        margin-left: 4px;
      }

      @include respond-to(sm) {
        font-size: $regular;
      }
    }

    &__content {
      max-width: 360px;
      width: 100%;
      border-radius: 20px;
      padding: 15px;
      opacity: 1 !important;

      p {
        padding: 0px !important;
        margin: 0px !important;
        font-size: 16px !important;
      }
    }
  }
`;

export default staticStyles;
