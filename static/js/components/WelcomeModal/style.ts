import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .welcome-modal {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9999;
    top: 0;
    left: 0;
    background: #231c4ec7;
    display: flex;
    align-items: center;
    justify-content: center;

    .welcome-modal-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      background: #120d48;
      padding: 30px;
      gap: 20px;
      max-width: 450px;
      color: white;

      .welcome-close-icon {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 15px;
        height: 15px;
        background: #f5f6fad6;
      }

      h3 {
        font-size: 24px;
        text-align: center;
      }

      .desc {
        font-size: 16px;

        a {
          color: #7159ff;
        }
      }
    }
  }

  .CheckBoxField {
    color: wheat !important;
  }
`;

export default staticStyles;
