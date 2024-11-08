import * as React from "react";
import Box from "@mui/material/Box";

import {
  FormControl,
  Grid,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Modal,
  MenuItem,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Spinner from "../../commons/Spinner";
import { useState } from "react";
import ModalHeader from "../../modals/ModalHeader";
import ModalFooter from "../../modals/ModalFooter";
import { patchJsonData, postJsonData } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";
import { Icon } from "@iconify/react";
import { primaryLight, whiteColor } from "../../theme/setThemeColor";
import { useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const CreateEditLimitAccount = ({ refresh, edit = false, row }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = useState(false);
  const [accType, setAccType] = useState("default");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setAccType("default");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let data = {
      acc_no: form.acc_no.value,
      acc_name: form.acc_name.value,
      ifsc: form.ifsc.value,
      acc_type: accType,
      acc_limit: form.acc_limit.value,
      id: edit ? row.id : undefined,
    };

    edit
      ? patchJsonData(
          ApiEndpoints.ADMIN_ACCOUNTS_LIMITS,
          data,
          "",
          setRequest,
          (res) => {
            // console.log("res", res.data);
            okSuccessToast(res?.data?.message);
            if (refresh) refresh();
            handleClose();
          },
          (err) => {
            apiErrorToast(err);
            if (refresh) refresh();
          }
        )
      : postJsonData(
          ApiEndpoints.ADMIN_ACCOUNTS_LIMITS,
          data,
          setRequest,
          (res) => {
            // console.log("res", res.data);
            okSuccessToast(res?.data?.message);
            if (refresh) refresh();
            handleClose();
          },
          (err) => {
            apiErrorToast(err);
            if (refresh) refresh();
          }
        );
  };

  useEffect(() => {
    setAccType(row?.acc_type);
  }, [row]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      {" "}
      {edit ? (
        <Tooltip title="Edit Account">
          <IconButton onClick={handleOpen}>
            <Icon
              icon="basil:edit-solid"
              style={{ fontSize: "24px" }}
              className="refresh-icon-risk"
            />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Account">
          <Button
            variant="outlined"
            // className="button-transparent"
            className="refresh-icon-risk"
            onClick={handleOpen}
            startIcon={
              <IconButton
                sx={{
                  p: 0,
                  color: whiteColor(),
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            }
            sx={{ py: 0.3 }}
          >
            Account
          </Button>
        </Tooltip>
      )}
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Spinner loading={request} />
            <ModalHeader
              title={edit ? `Edit Account` : `Create Account`}
              handleClose={handleClose}
            />
            <Box
              component="form"
              id="accountlimit"
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
                      label="Account Name"
                      id="acc_name"
                      size="small"
                      required
                      defaultValue={edit ? row?.acc_name : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Account Number"
                      id="acc_no"
                      size="small"
                      required
                      defaultValue={edit ? row?.acc_no : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Account IFSC"
                      id="ifsc"
                      size="small"
                      required
                      defaultValue={edit ? row?.ifsc : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Account Type"
                      id="acc_type"
                      size="small"
                      required
                      select
                      value={accType}
                      onChange={(e) => setAccType(e.target.value)}
                    >
                      <MenuItem value="default">Select Account Type</MenuItem>
                      <MenuItem value="current">Current</MenuItem>
                      <MenuItem value="saving">Saving</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      label="Account Limit"
                      id="acc_limit"
                      size="small"
                      required
                      type="number"
                      defaultValue={edit ? row?.acc_limit : ""}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <ModalFooter
              form="accountlimit"
              type="submit"
              btn="Submit"
              disable={request}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default CreateEditLimitAccount;
