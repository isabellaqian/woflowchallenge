import "./App.css";
import {
  FrigadeChecklist,
  FrigadeForm,
  useFlows,
  useFlowOpens,
} from "@frigade/react";
import React, { useEffect, useState } from "react";

const MAX_STRING_LEN = 255;

function App() {
  const [nameMsg, setNameMsg] = useState(""); //the message that displays on a user's screen when they submit their name
  const [emailMsg, setEmailMsg] = useState(""); //the message that displays on a user's screen when they submit their email

  const FORM_ID = "flow_PLTYgrMBKsLFGQE4";
  const CHECKLIST_ID = "flow_kVvTD3OY6MlvTxJl";
  const { setOpenFlowState } = useFlowOpens();
  const {
    getFlowStatus,
    getStepStatus,
    markFlowNotStarted,
    StepData,
    markFlowCompleted,
    markStepCompleted,
  } = useFlows();

  const handleEmail = () => {
    // check from data for the email
    // check email string for validity
    // update user flow to completed if it's valid
    fetch("https://api.frigade.com/v1/public/flowResponses", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer api_public_R9LR2H8xvtKrYfbmWFKE6qeZo0ROTieHnY9yQVoRI0WmqV7rJqWhHEDp3IC21ia3",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEmailMsg("mooooo");
        const name = data.data[0].value;
        const email = data.data[0].value;
        const nameValidity = parseName(name);
        const emailValidity = parseEmail(email);
        if (nameValidity === "OK") {
          setNameMsg("Success!");
        } else {
          //nameValidity === "LEN_INVALID"
          setNameMsg(
            "You must enter a name that is between 1 and 255 characters long"
          );
        }
        if (emailValidity === "OK") {
          setEmailMsg("Success!");
        } else {
          switch (emailValidity) {
            case "LEN_INVALID":
              setEmailMsg(
                "You must enter an email that is between 1 and 255 characters long"
              );
              break;
            case "FORMAT_INVALID":
              setEmailMsg("You must enter a valid email address");
          }
        }
        if (nameValidity === "OK" && emailValidity === "OK") {
          markStepCompleted(CHECKLIST_ID, "email");
          markFlowCompleted(FORM_ID);
          // setOpenFlowState(FORM_ID);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const parseEmail = (email) => {
    //checks: 255 char or less, contains @ and . after, valid printable characters
    const regex = /^[\x20-\x7E]*$/;
    if (!regex.test(email)) {
      //check that all characters are printable, eg. not "\n"
      return "CHAR_INVALID";
    }
    if (email.length > MAX_STRING_LEN) {
      //check length
      return "LEN_INVALID";
    }
    if (!email.includes("@")) {
      return "NO_AT";
    }
    const clippedEmail = email.split("@"); //check there is @ and a . afterwards
    if (clippedEmail.length === 2) {
      if (clippedEmail[0].length > 0 && clippedEmail[1].includes(".")) {
        return "OK";
      }
    }
    return "FORMAT_INVALID";
  };
  const parseName = (name) => {
    //checks: 255 char or less
    const regex = /^[\x20-\x7E]*$/;
    if (!regex.test(name)) {
      //check that all characters are printable, eg. not "\n"
      return "CHAR_INVALID";
    }

    return name.length > 0 && name.length < MAX_STRING_LEN
      ? "OK"
      : "LEN_INVALID";
  };

  return (
    <div className="App container">
      {getStepStatus(CHECKLIST_ID, "introduction") === "COMPLETED_STEP" && (
        <FrigadeForm
          flowId={FORM_ID}
          type="large-modal"
          customVariables={{
            nameMsg: nameMsg,
            emailMsg: emailMsg,
          }}
          onButtonClick={(step: StepData) => {
            console.log(step);
            handleEmail();
          }}
        />
      )}
      <FrigadeChecklist
        flowId={CHECKLIST_ID}
        title="Getting Started"
        subtitle="Follow our quick checklist to get started"
        appearance={{
          styleOverrides: {
            button: {
              // "align-items": "center",
              marginInline: "auto",
            },
          },
        }}
      />
      <button
        onClick={() => {
          markFlowNotStarted(FORM_ID);
          markFlowNotStarted(CHECKLIST_ID);
        }}
      >
        Reset Demo
      </button>
    </div>
  );
}

export default App;
