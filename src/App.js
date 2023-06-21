import "./App.css";
import {
  FrigadeChecklist,
  FrigadeForm,
  useFlows,
  useFlowOpens,
  useUser,
} from "@frigade/react";
import React, { useEffect, useState } from "react";
import Popup from "./Popup.js";

const MAX_STRING_LEN = 255;

function App() {
  const CHECKLIST_ID = "flow_kVvTD3OY6MlvTxJl";
  const { setOpenFlowState } = useFlowOpens();
  const { addPropertiesToUser } = useUser();
  const {
    getFlowStatus,
    getStepStatus,
    markFlowNotStarted,
    StepData,
    markFlowCompleted,
    markStepCompleted,
  } = useFlows();

  const [dialog, setDialog] = useState(false);
  const [inputSuccess, setInputSuccess] = useState([]);

  useEffect(() => {
    if (
      getStepStatus(CHECKLIST_ID, "introduction") === "COMPLETED_STEP" &&
      inputSuccess.length === 0
    ) {
      setDialog(true);
    }
  });

  function toggleDialog() {
    setDialog(!dialog);
  }
  function setSuccess(name, email) {
    console.log("set success, ", name);
    setInputSuccess([name, email]);
    markFlowNotStarted(CHECKLIST_ID); //need to reset
    //send data to frigade
    //working curl command:
    // curl --request POST \
    // --url https://api.frigade.com/v1/public/flowResponses \
    // -H 'Content-Type: application/json' --header 'Authorization: Bearer api_public_R9LR2H8xvtKrYfbmWFKE6qeZo0ROTieHnY9yQVoRI0WmqV7rJqWhHEDp3IC21ia3' -d '{ "flowSlug": "flow_kVvTD3OY6MlvTxJl", "foreignUserId": "user1", "actionType": "COMPLETED_STEP", "stepId": "email", "createdAt": "2023-06-17T01:32:00Z", "data": "{\"field\": \"testing\"}"}'
    fetch("https://api.frigade.com/v1/public/flowResponses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer api_public_R9LR2H8xvtKrYfbmWFKE6qeZo0ROTieHnY9yQVoRI0WmqV7rJqWhHEDp3IC21ia3",
      },
      body: JSON.stringify({
        flowSlug: "flow_kVvTD3OY6MlvTxJl",
        foreignUserId: "user1", //TODO: replace with actual user id using localstorage
        actionType: "COMPLETED_STEP",
        stepId: "email",
        createdAt: new Date().toISOString(),
        data: "name: " + name + ", email: " + email,
      }),
    }).then((response) => {
      console.log(response);
    });
    markStepCompleted(CHECKLIST_ID, "email");
    markStepCompleted(CHECKLIST_ID, "introduction");
  }

  return (
    <div className="App container">
      <Popup open={dialog} handleClose={toggleDialog} setSuccess={setSuccess} />
      <FrigadeChecklist
        flowId={CHECKLIST_ID}
        title="Getting Started"
        subtitle="Follow our quick checklist to get started"
        appearance={{
          styleOverrides: {
            button: {
              marginInline: "auto",
            },
          },
        }}
      />
      <button
        onClick={() => {
          // markFlowNotStarted(FORM_ID);
          markFlowNotStarted(CHECKLIST_ID);
        }}
      >
        Reset Demo
      </button>
    </div>
  );
}

export default App;
