import React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import { Stack } from "@mui/material";

function Popup({ open, handleClose, setSuccess }) {
  const [name, setName] = useState(""); //the message that displays on a user's screen when they submit their name
  const [email, setEmail] = useState(""); //the message that displays on a user's screen when they submit their email
  const [errorMsg, setErrorMsg] = useState([]);
  const MAX_STRING_LEN = 255;

  const parseError = () => {
    console.log(parseName("\n"));
    console.log(name);
    console.log(name === "\n");
    const nameValidity = parseName(name);
    const emailValidity = parseEmail(email);
    console.log(nameValidity, emailValidity);
    let newErrMsg = [];
    if (nameValidity != "OK") {
      switch (nameValidity) {
        case "LEN_INVALID":
          newErrMsg.push(
            "You must enter a name that is between 1 and 255 characters long."
          );
          break;
        case "CHAR_INVALID":
          newErrMsg.push(
            "You must enter a name that contains only printable characters."
          );
          break;
      }
    }
    if (emailValidity != "OK") {
      switch (emailValidity) {
        case "LEN_INVALID":
          newErrMsg.push(
            "You must enter an email that is between 1 and 255 characters long"
          );
          break;
        case "NO_AT":
          newErrMsg.push("You must enter a valid email address");
          break;
        case "FORMAT_INVALID":
          newErrMsg.push("You must enter a valid email address");
          break;
      }
    }
    if (nameValidity === "OK" && emailValidity === "OK") {
      setSuccess(name, email);
      handleClose();
      console.log("success");
    }
    setErrorMsg(newErrMsg);
  };
  //If there are error messages, render them
  const renderError = (errorMsg) => {
    return (
      <div className="errorMessage">
        {errorMsg.map((msg, idx) => {
          return <p key={idx}>{msg}</p>;
        })}
      </div>
    );
  };

  const parseEmail = (email) => {
    //checks: 255 char or less, contains @ and . after, valid printable characters
    const regex = /^[\x20-\x7E]*$/;
    if (!regex.test(email)) {
      //check that all characters are printable, eg. not "\n"
      return "CHAR_INVALID";
    }
    if (email.length > MAX_STRING_LEN || email.length <= 0) {
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
    //small bug: interprets string as literal, so \n is valid
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
    <div>
      <Dialog open={open} fullWidth={"xs"}>
        <DialogTitle>Let's get to know you!</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack spacing={2} style={{ paddingTop: "15px" }}>
            <Typography>What is your name?*</Typography>
            <TextField
              required
              id="outlined"
              placeholder="John Smith"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Typography>What is your email?*</Typography>
            <TextField
              required
              id="outlined"
              placeholder="john@woflow.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                setErrorMsg([]);
                parseError();
              }}
            >
              Submit
            </Button>
          </Stack>
          {/* //also need to reset error */}
          {errorMsg.length > 0 && renderError(errorMsg)}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Popup;
