import { useCallback, useEffect, useState } from 'react';

import staticStyles from './style';
import DefaultButton from '../basic/DefaultButton';
import CheckBoxField from '../fields/CheckBoxField';

const OFFSET_DAYS = 30;

export default function WelcomeModal() {
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const hideWelcomeModal = localStorage.getItem('hideWelcomeModal');
    const hideWelcomeModalDate = hideWelcomeModal ? new Date(hideWelcomeModal) : new Date();

    setOpenWelcomeModal(hideWelcomeModalDate <= new Date());
  }, [setOpenWelcomeModal]);

  const agreeButtonHandler = useCallback(() => {
    let agreeDate = new Date();

    if (agree) {
      agreeDate.setDate(agreeDate.getDate() + OFFSET_DAYS);
    }

    localStorage.setItem('hideWelcomeModal', agreeDate.toString());
    setOpenWelcomeModal(false);
  }, [agree, setOpenWelcomeModal]);

  return (
    <>
      {openWelcomeModal && (
        <div className={`welcome-modal`}>
          <div className={`welcome-modal-body`}>
            <h3>Welcome to UwU Lend</h3>
            <p className="desc">
              UwU Lend is a decentralized, non-custodial lending protocol.
              <br />
              <br />
              {/*This website is a community project hosted and served on the distributed, peer-to-peer{' '}*/}
              {/*<a href="https://ipfs.io/" target="_blank" rel="noreferrer">*/}
              {/*  IPFS network.*/}
              {/*</a>*/}
              {/*<br />*/}
              {/*<br />*/}
              By accessing the UwU website, you agree to the{' '}
              <a href="https://docs.uwulend.fi/legal-disclaimer" target="_blank" rel="noreferrer">
                Terms of Use.
              </a>
            </p>

            <CheckBoxField
              value={agree}
              name="WelcomModal__checkbox"
              onChange={() => setAgree(!agree)}
              title="I have read and agree to this message, don't show it again for 30 days."
            />

            <DefaultButton onClick={agreeButtonHandler} title="Agree" size="big" />
          </div>
        </div>
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
