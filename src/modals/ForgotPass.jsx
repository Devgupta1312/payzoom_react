import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import { useState } from "react";
import { PATTERNS } from "../utils/ValidationUtil";
import { blackColor, whiteColor } from "../theme/setThemeColor";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,

  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const ForgotPass = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [isMobV, setIsMobV] = useState(true);
  const [request, setRequest] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      username: form.username.value,
    };
    setRequest(true);
    postJsonData(
      ApiEndpoints.FORGOT_PASS,
      data,
      setRequest,
      (res) => {
        okSuccessToast("Password sent to registered mobile number");
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Button
        // className="otp-hover-purple"
        variant="text"
        style={{
          fontSize: "14px",
          textTransform: "capitalize",
          padding: "2px 8px",
          color: whiteColor(),
        }}
        onClick={handleOpen}
      >
        Forgot Password
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Forgot Password" handleClose={handleClose} />
          <Box
            component="form"
            id="forgotPass"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid
              container
              sx={{ pt: 1, display: "flex", justifyContent: "center" }}
            >
              <Grid item md={10} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Enter Registered Mobile number"
                    id="username"
                    size="small"
                    type="number"
                    required
                    error={!isMobV}
                    helperText={!isMobV ? "Enter valid Username" : ""}
                    onChange={(e) => {
                      setIsMobV(PATTERNS.MOBILE.test(e.target.value));
                      if (e.target.value === "") setIsMobV(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "+" || e.key === "-") {
                        e.preventDefault();
                      }
                      if (e.target.value.length === 10) {
                        if (e.key.toLowerCase() !== "backspace")
                          e.preventDefault();
                        if (e.key.toLowerCase() === "backspace") {
                        }
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <ModalFooter
            form="forgotPass"
            request={request}
            btn="Submit"
            disable={!isMobV}
          />
        </Box>
      </Modal>
    </Box>
  );
};
export default ForgotPass;
