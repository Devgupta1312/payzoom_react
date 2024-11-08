import React, { useState } from "react";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  Box,
  Modal,
  Tooltip,
  MenuItem,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ApiEndpoints from "../network/ApiEndPoints";
import { get, postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import MyButton from "../component/MyButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const UpdateAccount = ({ row, refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [crStatus, setCrStatus] = useState(row.crstatus);
  const [asmList, setAsmList] = useState([]);
  const [request, setRequest] = useState(false);
  const [currentAsm, setCurrentAsm] = useState(
    row && row.asm && row.asm.replace("\t", "")
  );
  const updateAccount = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      id: row.id,
      name: form.name.value,
      establishment: form.b_name.value,
      mobile: form.number.value,
      asm: currentAsm,
      creditlimit: form.crLimit.value,
      creditstatus: crStatus,
    };
    setRequest(true);
    postJsonData(
      ApiEndpoints.UPDATE_ACCOUNT,
      data,
      setRequest,
      (res) => {
        okSuccessToast("Account Updated successfully");
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const getAsmList = () => {
    get(
      ApiEndpoints.GET_USERS,
      `page=1&paginate=10&role=Asm&export=`,
      setRequest,
      (res) => {
        const asmArray = res.data.data;
        setAsmList(
          asmArray &&
            asmArray.map((item) => {
              return {
                id: item.id,
                name: item.name,
              };
            })
        );
        setOpen(true);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const handleOpen = () => {
    getAsmList();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeCrStatus = (event) => {
    setCrStatus(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Tooltip title="update Account">
        <MyButton text="Edit" onClick={handleOpen} ml={1} />
        {/* <IconButton
          variant="contained"
          style={{ fontSize: "10px", marginLeft: "5px", color: "#DC5F5F" }}
          onClick={handleOpen}
        >
          <DriveFileRenameOutlineIcon />
        </IconButton> */}
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Update Account" handleClose={handleClose} />
          <Box
            component="form"
            id="update-account"
            noValidate
            autoComplete="off"
            onSubmit={updateAccount}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={6} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Name"
                    id="name"
                    size="small"
                    required
                    defaultValue={row.name}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Business Name"
                    id="b_name"
                    size="small"
                    required
                    defaultValue={row.establishment}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Number"
                    id="number"
                    size="small"
                    required
                    defaultValue={row.mobile}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    select
                    label="ASM"
                    id="asm"
                    size="small"
                    required
                    // defaultValue={row && row.asm.replace("\t", "")}
                    value={currentAsm}
                    onChange={(e) => {
                      setCurrentAsm(e.target.value);
                    }}
                  >
                    {asmList &&
                      asmList.length > 0 &&
                      asmList.map((asm, index) => {
                        return (
                          <MenuItem key={index} value={asm.name}>
                            {asm.name}
                          </MenuItem>
                        );
                      })}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Credit Limit"
                    id="crLimit"
                    size="small"
                    required
                    defaultValue={row.creditlimit}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    select
                    label="Credit Status"
                    id="crStatus"
                    size="small"
                    required
                    defaultValue={crStatus}
                    onChange={handleChangeCrStatus}
                  >
                    <MenuItem dense value="1">
                      Active
                    </MenuItem>
                    <MenuItem dense value="0">
                      InActive
                    </MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>
            <ModalFooter
              form="update-account"
              request={request}
              btn="save account"
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default UpdateAccount;
