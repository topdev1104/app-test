import css from 'styled-jsx/css';

/*language=SCSS*/
const staticStyles = css.global`
  @import 'src/_mixins/vars';
  @import 'src/_mixins/screen-size';

  .ButtonTabs {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 10.5px;
    gap: 12px;
    width: 424px;
    background: rgba(13, 9, 63, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 48px;

    @include respond-to(sm) {
      width: 354px;
    }

    button {
      width: 165px;

      // &:first-child {
      //   border-top-left-radius: 5px;
      //   border-bottom-left-radius: 5px;
      // }

      // &:last-child {
      //   border-top-right-radius: 5px;
      //   border-bottom-right-radius: 5px;
      // }
    }
  }
`;

export default staticStyles;
