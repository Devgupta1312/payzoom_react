import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  Avatar,
} from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
import PinInput from "react-pin-input";
import { rupee } from "../iconsImports";
import ResetMpin from "./ResetMpin";
import useCommonContext from "../store/CommonContext";

const MoneyTransferModal = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [mpin, setMpin] = useState("");
  const { getRecentData } = useCommonContext();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    // height: { xs: "35vh", md: "55vh" },
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    console.log("values ", form);
    let amt = document.getElementById("amount").value;
    const data = {
      to_id: row.id,
      pf: "WEB",
      req_type: "CHAIN",
      amount: amt,
      mpin: mpin,
    };
    setRequest(true);
    postJsonData(
      ApiEndpoints.MONEY_TRANSFER,
      data,
      setRequest,
      (res) => {
        getRecentData();
        okSuccessToast("Request Processed successfully");
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
      <Tooltip title="Money Transfer">
        <IconButton onClick={handleOpen}>
          <Avatar
            alt="Remy Sharp"
            src={rupee}
            sx={{
              width: 28,
              height: 28,
              border: "1px solid #9f86c0",
              color: "#0077b6",
            }}
          />
          {/* <CurrencyRupeeIcon /> */}
        </IconButton>
      </Tooltip>
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader title="Money Transfer" handleClose={handleClose} />
            <Box
              component="form"
              id="money_transfer"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Retailer"
                      id="retailer"
                      size="small"
                      disabled
                      defaultValue={row.establishment}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      select
                      label="Payment Type"
                      id="payment_type"
                      size="small"
                      defaultValue="CREDIT"
                      required
                    >
                      <MenuItem value="CREDIT">CREDIT</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Amount"
                      id="amount"
                      size="small"
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <FormControl>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      M-PIN
                    </div>
                    <PinInput
                      length={6}
                      type="password"
                      onChange={(value, index) => {
                        setMpin(value);
                      }}
                      inputMode="text"
                      regexCriteria={/^[0-9]*$/}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  <ResetMpin variant="text" />
                </Grid>
              </Grid>
            </Box>
            <ModalFooter form="money_transfer" request={request} btn="Done" />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default MoneyTransferModal;
