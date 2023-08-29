import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .ManageRadiant__content-lock {
    margin-bottom: 15px;
    .TxConfirmationView {
      background: transparent !important;
      box-shadow: none !important;
      backdrop-filter: blur(0) !important;
    }
    .ManageRadiant__input-label {
      font-weight: 400;
      color: gray;
    }

    .ManageRadiant__value {
      p {
        color: gray;
      }
    }

    .BasicForm {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 24px;
      margin-top: 15px;
      margin-bottom: 10px;
      width: 100%;
      max-width: 100%;

      @include respond-to(sm) {
        flex-direction: column;
      }

      .BasicForm__inner {
        width: 100%;
      }

      .AmountField .AmountField__input input {
        padding-top: 11px;
        padding-bottom: 11px;
      }

      .BasicField input {
        font-size: $medium;
      }

      .BasicForm__buttons {
        margin-top: 0;
        margin-left: 10px;

        @include respond-to(sm) {
          margin-top: 10px;
          margin-left: 0;
        }
      }
    }
  }
`;

export default staticStyles;
