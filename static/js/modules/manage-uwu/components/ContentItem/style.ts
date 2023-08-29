import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .ManageRadiant__content-item {
    background: linear-gradient(180deg, rgba(28, 22, 91, 0.3) 0%, rgba(28, 22, 91, 0.1) 103.62%);
    box-shadow: 0px 4px 4px rgba(4, 2, 27, 0.2);
    backdrop-filter: blur(15px);
    border-radius: 24px;
    height: 100%;
    padding: 32px;
    color: white;

    @include respond-to(sm) {
      padding: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }

    p {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.014em;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .ManageRadiant__content-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 27px;
    line-height: 32px;
    color: #ffffff;

    h3 {
      font-size: $large;
      position: relative;

      &:after {
        font-weight: 600;
        font-size: 27px;
        line-height: 32px;
        /* identical to box height, or 119% */

        color: #ffffff;
        content: '';
        position: absolute;
        left: 0;
        top: -4px;
        width: 30px;
        height: 30px;
      }
    }

    span {
      display: felx;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
        0deg,
        rgba(49, 40, 147, 0.2) 0%,
        rgba(33, 25, 121, 0.4) 49.48%,
        rgba(49, 40, 147, 0.2) 100%,
        rgba(49, 40, 147, 0.2) 100%
      );
      opacity: 0.8;
      border: 1px solid rgba(128, 121, 203, 0.4);
      border-radius: 8px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.01em;
      color: rgba(255, 255, 255, 0.8);
      padding: 4px 8px;
      font-size: $large;
    }
  }

  .ManageRadiant__content-description {
    margin-top: 15px;

    p {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      /* identical to box height, or 150% */

      letter-spacing: 0.014em;

      /* White/60 */

      color: rgba(255, 255, 255, 0.6);

      &:last-of-type {
        margin-bottom: 0;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.014em;
        color: rgba(255, 255, 255, 0.6);
        text-decoration: revert;
      }
    }
  }

  .ManageRadiant__content-form {
    display: flex;
    flex-direction: column;
  }

  .ManageRadiant__form-legend {
    display: flex;
    justify-content: space-between;
  }

  .ManageRadiant__input-label {
    font-size: $medium;
    color: #131313;
    font-weight: 600;
  }

  .ManageRadiant__value {
    height: 30px;
    text-align: right;
  }

  .ManageRadiant__value-rnd {
    color: #131313;
    font-size: $medium;
  }

  .ManageRadiant__value-usd {
    color: #7f7f7f;
    font-size: $extraSmall;
  }

  .ManageRadiant__form-controls {
    display: flex;
    justify-content: space-between;

    .ConnectButton__inner {
      width: 100px !important;
      min-height: 32px !important;
    }
  }

  .ManageRadiant__form-input {
  }

  .ManageRadiant__form-button {
  }
`;

export default staticStyles;
