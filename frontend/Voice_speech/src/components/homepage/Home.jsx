// import React, { useState } from 'react';
// import "./Home.css";
// import Voice from '../voice/Voice';
// import aitalk from '../Assets/Technology.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophoneLines } from "@fortawesome/free-solid-svg-icons";
// const Home = ({ onOpenVoice }) => {
//   const [button, setButton] = useState(true);

//   const handleClick = () => {
//     setButton(false);
//   };

//   return (
//     <>
//       {button ? (
//         <div className='main'>
//            <div className='ai-img'><img src={aitalk} alt="logo" /></div>
//           <div onClick={onOpenVoice}><FontAwesomeIcon className='micpho' icon={faMicrophoneLines} /></div>
//         </div>
//       ) : (
//         <Voice />
//       )}
//     </>
//   );
// };

// export default Home;


import React, { useState } from 'react';
import "./Home.css";
import Voice from '../voice/Voice';
import aitalk from '../Assets/Technology.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneLines } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [button, setButton] = useState(true);

  const handleOpenVoice = () => {
    setButton(false);
  };

  const handleCloseVoice = () => {
    setButton(true);
  };

  return (
    <>
      {button ? (
        <div className='main'>
          <div className='ai-img'><img src={aitalk} alt="logo" /></div>
          <div onClick={handleOpenVoice}>
            <FontAwesomeIcon className='micpho' icon={faMicrophoneLines} />
          </div>
        </div>
      ) : (
        <Voice onClose={handleCloseVoice} />
      )}
    </>
  );
};

export default Home;
