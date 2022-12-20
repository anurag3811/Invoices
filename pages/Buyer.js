import Header from "../components/Header";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { useWeb3Contract } from "react-moralis";
import main from "../contracts/main.json";
import { ethers } from "ethers";
import Selector2 from "../components/Selector2";
import React from "react";

const Buyer = () => {
  const mainaddress = "0x64F8C7C97196dFDA93d24e0540362d750241216E";
  const { Moralis, isWeb3Enabled, chainId: chainIdHex, account } = useMoralis();
  const [query, setquery] = useState("");
  const [temp, settemp] = useState("");
  const [arr, setarr] = useState([]);
  const { runContractFunction: getinvoices } = useWeb3Contract({
    abi: main,
    contractAddress: mainaddress,
    functionName: "getinvoices",
    params: {},
  });

  const {
    //settle invoice function
    runContractFunction: settle_invoice,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: main,
    contractAddress: mainaddress,
    functionName: "settle_invoice",
    params: { _index: temp },
    msgValue: parseInt(arr[temp]?.[3]),
  });

  async function updateUIValues() {
    const finalarr = await getinvoices();
    setarr(finalarr);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "INVOICE CREATED",
      title: "INVOICE CREATED",
      position: "topR",
      icon: "bell",
    });
  };
  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
      updateUIValues();
      handleNewNotification(tx);
    } catch (error) {
      console.log(error);
    }
  };

  function mapper(contracts) {
    if (contracts[6] == false) {
      return (
        <div>
          <div className="flex justify-center">
            <div className=" m-3 p-2  w-1/3 bg-white rounded-md  mb-3">
              <span>Invoice Number:</span>
              <span>{contracts[0].toString()}</span>
              <br />
              <span>Paid/Settled:</span>
              <span>{contracts[5].toString()}</span>
              <br />
              <span>Buyer Pan:</span>
              <span>{contracts[1]}</span>
              <br />
              <span>Seller Pan:</span>
              <span>{contracts[2]}</span>
              <br />
              <span>Amount (in ETH):</span>
              <span>{ethers.utils.formatEther(contracts[3])}</span>
              <br />
              <div>Creator:</div>
              <div>{contracts[7].toString()}</div>
              <div className="flex">
                <div>Description:</div>
                <div>{contracts[4]}</div>
              </div>
              <button
                className=" bg-slate-500 px-4 py-2 rounded-lg hover:text-slate-50"
                value={parseInt(contracts[0])}
                disabled={isLoading || isFetching}
                onClick={async (e) => {
                  settemp(e.target.value);
                  await settle_invoice({
                    onSuccess: handleSuccess,
                    onError: (error) => console.log(error),
                  });
                }}
              >
                {isLoading || isFetching ? (
                  <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full p-3"></div>
                ) : (
                  "Settle Invoice"
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <Header />
      <Selector2 />
      <div className="flex justify-center">
        <input
          placeholder="Search by Buyer PAN / Invoice Number"
          onChange={(e) => setquery(e.target.value.toLowerCase())}
          class="p-4 rounded-full  w-96 mt-8 mb-14"
          style={{ backgroundColor: "#272727" }}
        />
      </div>
      {arr ? (
        <div className=" w-full">
          {arr
            .filter(
              (contract) =>
                contract[1].toLowerCase().includes(query) ||
                parseInt(contract[0]).toString().includes(query) ||
                contract[4].toLowerCase().includes(query)
            )
            .map(mapper)}{" "}
        </div>
      ) : (
        <div class="flex justify-center mt-8">
          <div>Connect to Goerli Test-net!</div>
        </div>
      )}
    </div>
  );
};

export default Buyer;
