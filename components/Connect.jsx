import React from "react";
import { ConnectButton } from "web3uikit";

const Connect = () => {
  return (
    <div>
      <ConnectButton moralisAuth={false} />
    </div>
  );
};

export default Connect;
