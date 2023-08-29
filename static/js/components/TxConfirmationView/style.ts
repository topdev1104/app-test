import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .TxConfirmationView {
    padding: 32px;

    background: #08052e;
    box-shadow: 0px 4px 4px rgba(4, 2, 27, 0.2);
    backdrop-filter: blur(15px);
    border-radius: 24px;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex: 1;
    width: 650px;
    margin: 0 auto;
    @include respond-to(xl) {
      width: 590px;
    }
    @include respond-to(lg) {
      width: 590px;
    }
    @include respond-to(md) {
      width: 590px;
    }
    @include respond-to(sm) {
      width: 100%;
      max-width: 590px;
      padding: 10px;
    }

    &__content-inner {
      margin-bottom: 20px;
      width: 100%;
      text-align: center;
      @include respond-to(lg) {
        margin-bottom: 10px;
      }
      @include respond-to(md) {
        margin-bottom: 20px;
      }
    }
    &__contentInner {
      margin-bottom: 0;
    }

    &__content {
      padding: 15px;
      border-radius: $borderRadius;
    }

    &__actions-inner {
      width: 100%;
    }

    .TokenIcon.TokenIcon .TokenIcon__name {
      font-size: $large;
      @include respond-to(xl) {
        font-size: $medium;
      }
      @include respond-to(lg) {
        font-size: $small;
      }
      @include respond-to(md) {
        font-size: $medium;
      }
      @include respond-to(sm) {
        font-size: $regular;
      }
    }

    .InfoPanel {
      &:last-of-type {
        margin-top: 15px;
      }
    }
  }
`;

export default staticStyles;
