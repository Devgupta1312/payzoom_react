import React, { useContext, useEffect } from "react";
import {
  Avatar,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import AuthContext from "../store/AuthContext";
import { Box } from "@mui/system";
import { userAvt } from "../iconsImports";
import ChangePass from "../modals/ChangePass";
import ChangeMpin from "../modals/ChangeMpin";
import ResetMpin from "../modals/ResetMpin";
import { useState } from "react";
import { PATTERNS } from "../utils/ValidationUtil";
import { get, getAxios, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import Spinner from "../commons/Spinner";
// import BankSearch from "../component/BankSearch";
import UsernameChangeModal from "../modals/UsernameChangeModal";
// import ConfirmModal from "../modals/ConfirmModal";
import CommonMpinModal from "../modals/CommonMpinModal";
import UploadImageModal from "../modals/UploadImageModal";
import { useForm } from "react-hook-form";

import UploadPanModal from "../modals/UploadPanModal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ClearIcon from "@mui/icons-material/Clear";
import UploadAadhaarModal from "../modals/UploadAadhaarModal";
import HoverPopOpen from "../component/HoverPopOpen";
import { primaryColor, getEnv } from "../theme/setThemeColor";
import LockIcon from "@mui/icons-material/Lock";
import ShowDocsModal from "../modals/ShowDocsModal";
import { useLocation } from "react-router-dom";
import ChangeLayoutModal from "../modals/ChangeLayoutModal";
// import UserAddBankModal from "../modals/UserAddBankModal";
import UserBankList from "./UserBankList";
import AuthorizationLetters from "./AuthorizationLetters";
import { PROJECTS } from "../utils/constants";
import ViewVirtualAcct from "../modals/ViewVirtualAcct";

let bankObjCallBack;
const NewMyProfile = () => {
  const { handleSubmit } = useForm();
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  const access = authCtx.token;
  // console.log("user", user);
  const [selectedType, setSelectedType] = useState("personal");
  // console.log("selectedType", selectedType);
  const [editable, setEditable] = useState("");

  // const [gender, setGender] = useState(
  //   user && user.gender && capitalize(user.gender)
  // );
  const [gender, setGender] = useState(user?.gender?.toUpperCase());

  // validations hooks
  const [isEmailv, setIsEmailv] = useState(true);
  const [isMobv, setIsMobv] = useState(true);
  // const [isAccNov, setIsAccNov] = useState(true);
  // const [isIfscNov, setIsIfscNov] = useState(true);

  // const [bankSearchIfsc, setbankSearchIfsc] = useState();
  // radio buttons hooks
  const [radioButton, setradioButton] = useState(user && user.two_factor);
  const [prevRadioState, setprevRadioState] = useState(user && user.two_factor);
  const [MpinCallBackVal, setMpinCallBackVal] = useState();
  //
  const [progress, setProgress] = useState(false);
  const [openMPin, setopenMPin] = useState(false);
  const [isBig, setIsBig] = useState(true);

  // the aadhaar and pan files hook
  const [panFile, setPanFile] = useState();
  const [aadhaarFile, setAadhaarFile] = useState();
  const [panPreview, setPanPreview] = useState();
  // console.log("panPreview", panPreview);
  // console.log("aadhaarFile", aadhaarFile);
  const [aadhaarPreview, setAadhaarPreview] = useState();
  const [hideDocs, setHideDocs] = useState(false);
  const [docsImgApi, setDocsImgApi] = useState();

  const [aadhaarV, setAadhaarV] = useState(false);
  const [panV, setPanV] = useState(false);

  const envName = getEnv();
  const location = useLocation();
  // useEffect for opening doc when we come from modal
  useEffect(() => {
    if (location?.state?.docs) {
      setSelectedType("document");
    }
    return () => {};
  }, []);

  const handleClickScroll = () => {
    if (!isBig) {
      const element = document.getElementById("info-box");
      if (element) {
        // 👇 Will scroll smoothly to the top of the next section
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getUserAgain = () => {
    get(
      ApiEndpoints.GET_ME_USER,
      "",
      setProgress,
      (res) => {
        getAxios(access);
        const newuser = res.data.data;
        const docs = res.data.docs;
        authCtx.saveUser(newuser);
        if (docs && typeof docs === "object") {
          authCtx.setDocsInLocal(docs);
        }
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const twoFactorChange = () => {
    postJsonData(
      ApiEndpoints.TWOFA_AUTH,
      { mpin: MpinCallBackVal, auth_factor: radioButton },
      setProgress,
      (res) => {
        okSuccessToast(res.data.message);
        setMpinCallBackVal("");
        getUserAgain();
      },
      (err) => {
        apiErrorToast(err);
        setMpinCallBackVal("");
        setradioButton(user && user.two_factor);
        getUserAgain();
      }
    );
  };

  const showDocumentsAfterMpin = () => {
    postJsonData(
      ApiEndpoints.OBTAIN_DOCS,
      { mpin: MpinCallBackVal },
      setProgress,
      (res) => {
        const docs = res?.data?.data;
        setDocsImgApi(docs);
        setHideDocs(true);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const handleforms = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    let data;
    if (selectedType === "personal") {
      data = {
        id: user && user.id,
        name: form.name.value,
        email: form.email.value,
        mobile: form.alter_mob.value,
        gender: gender,
        address: form.address.value,
        pan: form.pan.value,
      };
    } else if (selectedType === "business") {
      data = {
        id: user && user.id,
        business_name: form.bname.value,
        business_address: form.b_address.value,
        business_pan: form.b_pan.value,
        gstin: form.gstin.value,
      };
    } else if (selectedType === "bank") {
      data = {
        id: user && user.id,
        acc_name: form.holder_name.value,
        bank: bankObjCallBack && bankObjCallBack.split(",")[0],
        acc_number: form.accNo.value,
        ifsc: form.ifsc.value,
      };
    }
    // else if (selectedType === "document") {
    //   data = {
    //     id: user && user.id,
    //     holder_name: form.holder_name.value,
    //     bank_name: form.bank_name.value,
    //     accNo: form.accNo.value,
    //     ifsc: form.ifsc.value,
    //   };
    // }
    postJsonData(
      ApiEndpoints.UPDATE_USER_PROFILE,
      data,
      setProgress,
      (res) => {
        const user = res.data.data;
        authCtx.saveUser(user);
        okSuccessToast("Profile updated");
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const validateImages = (image, imgOf) => {
    console.log("image", image);
    const fileSize = Math.round(image.size / 1024);
    const [img, typeofImg] = image?.type.split("/");

    const fileType = ["jpg", "JPG", "png", "PNG", "jpeg", "JPEG"];
    const messageFiles = ["jpg", "png", "jpeg"];
    if (!fileType.includes(typeofImg)) {
      if (imgOf === "pan") {
        setPanV(`Please upload a valid file format for Pan ${messageFiles}`);
        return `Please upload a valid file format for Pan ${messageFiles}`;
      } else {
        setAadhaarV(
          `Please upload a valid file format for Aadhaar ${messageFiles}`
        );
        return `Please upload a valid file format for Aadhaar ${messageFiles}`;
      }
    } else if (fileSize > 300) {
      if (imgOf === "pan") {
        setPanV(`File should be less than 300Kb for Pan`);
      } else {
        setAadhaarV(`File should be less than 300Kb for Aadhar`);
      }
    } else {
      if (imgOf === "pan") {
        setPanV(true);
        return true;
      } else {
        setAadhaarV(true);
        return true;
      }
    }
  };

  const handleImageUpload = () => {
    let aValid;
    let pValid;

    const formData = new FormData();

    aValid = validateImages(panFile, "pan");
    pValid = validateImages(aadhaarFile, "aadhaar");

    if (aValid === true && pValid === true) {
      formData.append("pan_image", panFile);
      formData.append("aadhaar_image", aadhaarFile);

      postJsonData(
        ApiEndpoints.UPLOAD_USER_KYC,
        formData,
        setProgress,
        (res) => {
          okSuccessToast("Documents uploaded Successfully");
          getUserAgain();
        },
        (err) => {
          apiErrorToast(err);
        }
      );
    }
  };

  useEffect(() => {
    if (MpinCallBackVal && MpinCallBackVal.length === 6) {
      if (selectedType === "authentication") twoFactorChange();
      if (selectedType === "document") showDocumentsAfterMpin();
    }
  }, [MpinCallBackVal]);

  // obj url of pan
  useEffect(() => {
    if (!panFile) {
      setPanPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(panFile);
    setPanPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [panFile]);

  // obj url of aadhaar
  React.useEffect(() => {
    if (!aadhaarFile) {
      setAadhaarPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(aadhaarFile);
    setAadhaarPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [aadhaarFile]);

  // know window size with javascript
  const changeApply = () => {
    if (window.innerWidth < 900) setIsBig(false);
    else if (window.innerWidth > 900) setIsBig(true);
  };

  // useEffect to apply window size event
  useEffect(() => {
    window.addEventListener("resize", changeApply);

    return () => {
      window.removeEventListener("resize", changeApply);
    };
  });

  return (
    <>
      <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        {/* the options selector */}
        <Grid
          item
          md={3}
          sm={12}
          xs={12}
          sx={{
            backgroundColor: "#fff",
            height: "auto",
            p: 2,
            mr: { lg: 2, md: 2, sm: 0, xs: 0 },
            mb: { lg: 2, md: 2, sm: 2, xs: 2 },
          }}
          className="card-css"
        >
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              borderRadius: "10px",
              px: 3,
              py: 2,
              textAlign: "left",
              mb: 1,
            }}
            className={`only-cursor myprofile-hover ${
              selectedType === "personal" ? "myprofile-active" : ""
            }`}
            onClick={() => {
              setSelectedType("personal");
              handleClickScroll();
            }}
          >
            <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
              Personal Information
            </div>
            <div style={{ fontSize: "12px" }}>
              Change Personal Information Here
            </div>
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              borderRadius: "10px",
              px: 3,
              py: 2,
              textAlign: "left",
              mb: 1,
            }}
            className={`only-cursor myprofile-hover ${
              selectedType === "business" ? "myprofile-active" : ""
            }`}
            onClick={() => {
              setSelectedType("business");
              handleClickScroll();
            }}
          >
            <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
              Business Information
            </div>
            <div style={{ fontSize: "12px" }}>
              Change Business Information Here
            </div>
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              borderRadius: "10px",
              px: 3,
              py: 2,
              textAlign: "left",
              mb: 1,
            }}
            className={`only-cursor myprofile-hover ${
              selectedType === "bank" ? "myprofile-active" : ""
            }`}
            onClick={() => {
              setSelectedType("bank");
              handleClickScroll();
            }}
          >
            <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
              Bank Information
            </div>
            {user && user.acc_number ? (
              <div style={{ fontSize: "12px" }}>Add Bank Account</div>
            ) : (
              <div style={{ fontSize: "12px" }}>Add Bank Account</div>
            )}
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              borderRadius: "10px",
              px: 3,
              py: 2,
              textAlign: "left",
              mb: 1,
            }}
            className={`only-cursor myprofile-hover ${
              selectedType === "document" ? "myprofile-active" : ""
            }`}
            onClick={() => {
              setSelectedType("document");
              handleClickScroll();
            }}
          >
            <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
              Documents
            </div>
            <div style={{ fontSize: "12px" }}>Upload Documents Here</div>
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{
              borderRadius: "10px",
              px: 3,
              py: 2,
              textAlign: "left",
              mb: 1,
            }}
            className={`only-cursor myprofile-hover ${
              selectedType === "authentication" ? "myprofile-active" : ""
            }`}
            onClick={() => {
              setSelectedType("authentication");
              handleClickScroll();
            }}
          >
            <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
              2-Factor Authentication
            </div>
            <div style={{ fontSize: "12px" }}>
              Enable 2-factor Authentication
            </div>
          </Grid>
          {(user?.role?.toLowerCase() === "ret" ||
            user?.role?.toLowerCase() === "dd" ||
            user?.role?.toLowerCase() === "ad") && (
            <Grid
              item
              md={12}
              sm={12}
              xs={12}
              sx={{
                borderRadius: "10px",
                px: 3,
                py: 2,
                textAlign: "left",
                mb: 1,
              }}
              className={`only-cursor myprofile-hover ${
                selectedType === "bc" ? "myprofile-active" : ""
              }`}
              onClick={() => {
                setSelectedType("bc");
                handleClickScroll();
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                BC Authorisation Letter
              </div>
              <div style={{ fontSize: "12px" }}>
                Download Authorisation Letter
              </div>
            </Grid>
          )}
        </Grid>
        {/* the center section */}
        <Grid
          item
          md={8}
          sm={12}
          xs={12}
          sx={{ backgroundColor: "#fff", mb: 2, height: "auto" }}
        >
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
            className="card-css"
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: {
                  lg: "row",
                  md: "row",
                  sm: "column",
                  xs: "column",
                },
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar
                  id="user_img"
                  alt="Remy Sharp"
                  src={
                    user &&
                    user.profile_image !== "0" &&
                    user.profile_image !== "1"
                      ? user.profile_image
                      : userAvt
                  }
                  sx={{ width: 90, height: 90 }}
                />
                <div
                  style={{ bottom: "-5%", right: "-5%", position: "absolute" }}
                >
                  <UploadImageModal
                    endpt={ApiEndpoints.UPLOAD_USER_PHOTO}
                    getUserAgain={getUserAgain}
                  />
                </div>
              </div>

              <Box
                component="div"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: { md: "start", xs: "center" },
                  marginLeft: { md: "28px", sm: "0px", xs: "0px" },
                }}
              >
                {/* namme */}
                <Box
                  component="div"
                  sx={{
                    fontSize: "28px",
                    fontWeight: "bolder",
                    display: "flex",
                    justifyContent: {
                      md: "space-between",
                      sm: "center",
                      xs: "center",
                    },
                  }}
                >
                  {authCtx && authCtx.user && authCtx.user.name}
                </Box>

                {/* role */}
                <Box
                  component="div"
                  sx={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "start",
                  }}
                >
                  {user.role === "Dd"
                    ? "Direct Dealer"
                    : user.role === "Ret"
                    ? "Retailer"
                    : user.role === "Ad"
                    ? "Area Distributor"
                    : user.role === "Admin"
                    ? "Admin"
                    : "Role"}
                </Box>
                {/* buttons */}
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "12px",
                  }}
                >
                  <ChangePass />
                  <ChangeMpin />
                  <ResetMpin />
                  {(user.role === "Ret" || user.role === "Dd") && (
                    <>
                      <ChangeLayoutModal />
                    </>
                  )}
                  {user.role !== "Admin" &&
                    user.role !== "Asm" &&
                    user.role !== "Zsm" && (
                      <>
                        <ViewVirtualAcct />
                      </>
                    )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={12} sm={12} xs={12} id="info-box">
            {/* personal box */}
            {selectedType === "personal" && (
              <Grid
                item
                // hidden={selectedType !== "personal"}
                className="card-css"
                sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
              >
                <Box
                  component="form"
                  id={selectedType}
                  validate
                  autoComplete="off"
                  onSubmit={handleforms}
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                    objectFit: "contain",
                    overflowY: "scroll",
                  }}
                  className="position-relative"
                >
                  {selectedType === "personal" && (
                    <Spinner loading={progress} />
                  )}

                  <Typography
                    sx={{
                      py: 2,
                      px: 2,
                      // position: "relative",
                    }}
                    className="my-profile-topography"
                  >
                    Change Personal Information Here
                  </Typography>

                  <Button
                    className="edit-profile-button"
                    variant="outlined"
                    sx={{ p: 0 }}
                    onClick={() => {
                      if (editable === "personal") {
                        setEditable("");
                      } else {
                        setEditable("personal");
                      }
                    }}
                  >
                    {editable === "personal" ? (
                      <ClearIcon className="edit-icon" />
                    ) : (
                      <ModeEditIcon className="edit-icon" />
                    )}
                    <Typography
                      sx={{
                        fontSize: "13px",
                        display: { md: "flex", sm: "none", xs: "none" },
                      }}
                    >
                      {editable === "personal" ? "Cancel" : "edit"}
                    </Typography>
                  </Button>
                  <Grid container sx={{ pt: 1 }}>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Name"
                          id="name"
                          size="small"
                          defaultValue={user.name}
                          disabled={editable !== "personal"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Email"
                          id="email"
                          size="small"
                          defaultValue={user.email}
                          error={!isEmailv}
                          disabled={editable !== "personal"}
                          helperText={!isEmailv ? "Enter valid Email Id" : ""}
                          onChange={(e) => {
                            setIsEmailv(PATTERNS.EMAIL.test(e.target.value));
                            if (e.target.value === "") setIsEmailv(true);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <UsernameChangeModal
                        uname={user && user.username}
                        disabled={editable !== "personal"}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Alternate Mobile"
                          id="alter_mob"
                          size="small"
                          defaultValue={user.mobile}
                          disabled={editable !== "personal"}
                          error={!isMobv}
                          helperText={!isMobv ? "Enter valid Mobile" : ""}
                          onChange={(e) => {
                            setIsMobv(PATTERNS.MOBILE.test(e.target.value));
                            if (e.target.value === "") setIsMobv(true);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Gender"
                          id="gender"
                          size="small"
                          // select={user && user.gender ? false : true}
                          select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          // defaultValue={user && capitalize(user.gender)}
                          // disabled={user && user.gender ? true : false}
                          disabled={editable !== "personal"}
                        >
                          <MenuItem value="MALE">
                            <div style={{ textAlign: "left" }}>Male</div>
                          </MenuItem>
                          <MenuItem value="FEMALE ">
                            <div style={{ textAlign: "left" }}>Female</div>
                          </MenuItem>
                          <MenuItem value="OTHERS">
                            <div style={{ textAlign: "left" }}>Other</div>
                          </MenuItem>
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Address"
                          id="address"
                          size="small"
                          defaultValue={
                            user?.address ? user.address : user?.p_address
                          }
                          disabled={editable !== "personal"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="PAN"
                          id="pan"
                          size="small"
                          defaultValue={user.pan}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                <Button
                  className="button-red"
                  variant="contained"
                  type="submit"
                  form={selectedType}
                  sx={{
                    width: "96%",
                    textTransform: "capitalize",
                    mt: 1,
                    backgroundColor: "#231942",
                    "&:hover": {
                      backgroundColor: "#231942",
                    },
                  }}
                  disabled={!isEmailv || !isMobv || editable !== "personal"}
                >
                  Update Information
                </Button>
              </Grid>
            )}

            {/* business box */}
            {selectedType === "business" && (
              <Grid
                item
                // hidden={selectedType !== "business"}
                className="card-css"
                sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
              >
                <Box
                  component="form"
                  onSubmit={handleforms}
                  id={selectedType}
                  noValidate
                  autoComplete="off"
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                    objectFit: "contain",
                    overflowY: "scroll",
                  }}
                  className="position-relative"
                >
                  <Typography
                    sx={{
                      py: 2,
                      px: 2,
                    }}
                    className="my-profile-topography"
                  >
                    Change Business Information Here
                  </Typography>

                  <Button
                    className="edit-profile-button"
                    variant="outlined"
                    sx={{ p: 0 }}
                    onClick={() => {
                      if (editable === "business") {
                        setEditable("");
                      } else {
                        setEditable("business");
                      }
                    }}
                  >
                    {editable === "business" ? (
                      <ClearIcon className="edit-icon" />
                    ) : (
                      <ModeEditIcon className="edit-icon" />
                    )}
                    <Typography
                      sx={{
                        fontSize: "13px",
                        display: { md: "flex", sm: "none", xs: "none" },
                      }}
                    >
                      {editable === "business" ? "Cancel" : "edit"}
                    </Typography>
                  </Button>
                  <Grid container sx={{ pt: 1 }}>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Business Name"
                          id="bname"
                          size="small"
                          defaultValue={user.name}
                          // disabled={editable !== "business"}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label=" Business Address"
                          id="b_address"
                          size="small"
                          defaultValue={user.address}
                          disabled={editable !== "business"}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="PAN"
                          id="b_pan"
                          size="small"
                          defaultValue={user.pan}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="GSTIN"
                          id="gstin"
                          size="small"
                          defaultValue={user.gstin}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Button
                  variant="contained"
                  type="submit"
                  form={selectedType}
                  sx={{
                    width: "96%",
                    textTransform: "capitalize",
                    mt: 1,
                    backgroundColor: "#231942",
                    "&:hover": {
                      backgroundColor: "#231942",
                    },
                  }}
                  disabled={editable !== "business"}
                >
                  Update Information
                </Button>
              </Grid>
            )}

            {/* bank box */}
            {selectedType === "bank" && (
              <Grid
                item
                className="card-css"
                sx={{
                  py: 2,
                  px: 1.5,
                  mt: 2,
                  mb: { md: 0, xs: 5 },
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleforms}
                  id={selectedType}
                  validate
                  autoComplete="off"
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                    objectFit: "contain",
                    overflowY: "scroll",
                  }}
                  className="position-relative"
                >
                  {selectedType === "bank" && <Spinner loading={progress} />}
                  {user && user.acc_number ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography className="my-profile-topography">
                        Add Bank Account
                      </Typography>
                      {/* <UserAddBankModal /> */}
                    </div>
                  ) : (
                    <Typography
                      sx={{
                        py: 2,
                        px: 2,
                      }}
                      className="my-profile-topography"
                    >
                      Change Bank Information Here
                    </Typography>
                  )}

                  {/* old code of account */}
                  {/* <Grid container sx={{ pt: 1 }}>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Account holder Name"
                          id="holder_name"
                          size="small"
                          defaultValue={user.acc_name}
                          disabled={user.acc_name}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="Account number"
                          id="accNo"
                          size="small"
                          defaultValue={user.acc_number}
                          disabled={user.acc_number}
                          error={!user.acc_number && !isAccNov}
                          helperText={
                            !user.acc_number && !isAccNov
                              ? "Enter valid Account Number"
                              : ""
                          }
                          onChange={(e) => {
                            if (!user.acc_number) {
                              setIsAccNov(
                                PATTERNS.ACCOUNT_NUMBER.test(e.target.value)
                              );
                              if (e.target.value === "") setIsAccNov(true);
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      {!user.bank ? (
                        <BankSearch
                          fromProfile={true}
                          label="Bank Name"
                          endpt={ApiEndpoints.GET_BANK_DMR}
                          bankObj={(bank) => {
                            bankObjCallBack = bank;
                          }}
                          ifscObj={(ifsc) => {
                            setbankSearchIfsc(ifsc);
                          }}
                        />
                      ) : (
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            label="Bank"
                            id="bank"
                            size="small"
                            defaultValue={user.bank}
                            disabled
                          />
                        </FormControl>
                      )}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          label="IFSC Code"
                          id="ifsc"
                          size="small"
                          defaultValue={
                            user.ifsc
                              ? user.ifsc
                              : bankSearchIfsc && bankSearchIfsc
                          }
                          // disabled={user.ifsc}
                          error={!user.ifsc && !isIfscNov}
                          helperText={
                            !user.ifsc && !isIfscNov
                              ? "Enter valid IFSC Number"
                              : ""
                          }
                          onChange={(e) => {
                            setbankSearchIfsc(e.target.value);
                            if (!user.ifsc) {
                              setIsIfscNov(PATTERNS.IFSC.test(e.target.value));
                              if (e.target.value === "") setIsIfscNov(true);
                            }
                          }}
                          focused={bankSearchIfsc}
                          disabled={user && user.ifsc}
                        />
                      </FormControl>
                    </Grid>
                  </Grid> */}
                </Box>
                <UserBankList />
                {/* {user && !user.acc_number && (
                  <Button
                    variant="contained"
                    type="submit"
                    form={selectedType}
                    sx={{
                      width: "96%",
                      textTransform: "capitalize",
                      mt: 1,
                      backgroundColor: "#231942",
                      "&:hover": {
                        backgroundColor: "#231942",
                      },
                    }}
                    // disabled={}
                  >
                    Update Information
                  </Button>
                )} */}
              </Grid>
            )}

            {/* document box */}
            {selectedType === "document" && (
              <Grid
                item
                className="card-css position-relative"
                sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
              >
                {authCtx.ifDocsUploaded &&
                  authCtx.ifDocsUploaded.aadhaar_image === 1 &&
                  authCtx.ifDocsUploaded &&
                  authCtx.ifDocsUploaded.pan_image === 1 && (
                    <div
                      hidden={hideDocs}
                      className="position-absolute text-primary fw-bolder fs-4"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        zIndex: 100,
                        top: 0,
                        left: "1px",
                        // position: "absolute",
                        backgroundColor: "#ffffff0",
                        borderRadius: "4px",
                        backdropFilter: "blur(20px)",
                        color: "#fff",
                        background: "rgba(255, 255, 255, 0.61)",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <LockIcon
                        sx={{ fontSize: "4rem" }}
                        onClick={() => setopenMPin(true)}
                        className="hover-zoom"
                      />
                      Click to view documents
                    </div>
                  )}

                <Box
                  component="form"
                  onSubmit={handleSubmit(handleImageUpload)}
                  id={selectedType}
                  noValidate
                  autoComplete="off"
                  sx={{
                    "& .MuiTextField-root": { m: 2 },
                    objectFit: "contain",
                    overflowY: "scroll",
                    py: 2,
                    px: 2,
                  }}
                  className="position-relative"
                >
                  <Typography
                    sx={{
                      py: 2,
                    }}
                    className="my-profile-topography"
                  >
                    Upload Documents Here
                    {authCtx.ifDocsUploaded &&
                      (authCtx.ifDocsUploaded.aadhaar_image === 0 ||
                        authCtx.ifDocsUploaded.pan_image === 0) && (
                        <HoverPopOpen />
                      )}
                  </Typography>
                  <Typography
                    textAlign="justify"
                    sx={{
                      pb: 2,
                    }}
                  >
                    Upload a self signed copy of Aadhaar and Pan <br />
                    <span style={{ fontSize: "14px" }}>
                      1. Only Jpg, Png, Jpeg Images. <br />
                      2. Image Should be less than 300Kb.
                    </span>
                  </Typography>
                  {/* the edit button */}
                  {/* {authCtx.ifDocsUploaded &&
                    (authCtx.ifDocsUploaded.aadhaar_image === 0 ||
                      authCtx.ifDocsUploaded.pan_image === 0) && (
                      <Button
                        className="edit-profile-button"
                        variant="outlined"
                        sx={{ p: 0 }}
                        onClick={() => {
                          if (editable === "document") {
                            setEditable("");
                          } else {
                            setEditable("document");
                          }
                        }}
                      >
                        {editable === "document" ? (
                          <ClearIcon className="edit-icon" />
                        ) : (
                          <ModeEditIcon className="edit-icon" />
                        )}
                        <Typography
                          sx={{
                            fontSize: "13px",
                            display: { md: "flex", sm: "none", xs: "none" },
                          }}
                        >
                          {editable === "document" ? "Cancel" : "edit"}
                        </Typography>
                      </Button>
                    )} */}
                  {/* upload aadhaar  and pan*/}
                  <Grid container md={12} xs={12} sx={{ pt: 1 }}>
                    {authCtx.ifDocsUploaded &&
                    authCtx.ifDocsUploaded.aadhaar_image === 1 ? (
                      <>
                        <Grid
                          item
                          md={5.6}
                          sx={{
                            mr: { md: 2, sm: 0, xs: 0 },
                            mt: "16px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: "60px", mb: 1 }}
                            color="success"
                          />
                          <Typography sx={{ textAlign: "center" }}>
                            Aadhaar Card Uploaded
                          </Typography>
                        </Grid>
                      </>
                    ) : (
                      <Grid item md={5.6} sx={{ mr: { md: 2, sm: 0, xs: 0 } }}>
                        <UploadAadhaarModal
                          callbackImage={(image) => {
                            setAadhaarFile(image);
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: "poppins",
                            fontSize: "12px",
                            color: "red",
                            fontWeight: "bold",
                            textAlign: "left",
                            mt: 2,
                          }}
                        >
                          {(aadhaarV !== false || aadhaarV !== true) &&
                            aadhaarV}
                        </Typography>
                      </Grid>
                    )}
                    {((authCtx.ifDocsUploaded &&
                      authCtx.ifDocsUploaded.aadhaar_image === 1) ||
                      aadhaarFile) && (
                      <ShowDocsModal
                        docsImgApi={docsImgApi}
                        aadhaarPreview={aadhaarPreview}
                        title="Aadhaar"
                      />
                      // old code for docs preview
                      // <Grid
                      //   item
                      //   md={6}
                      //   sx={{
                      //     border: "1px solid #E2E2E4",
                      //     textAlign: "center",
                      //     marginTop: "1.2rem",
                      //     padding: "0.7rem",
                      //     display: "flex",
                      //     flexDirection: "column",
                      //     alignItems: "center",
                      //   }}
                      // >
                      //   <img
                      //     src={
                      //       docsImgApi && docsImgApi.aadhaar_image
                      //         ? docsImgApi.aadhaar_image
                      //         : aadhaarPreview
                      //     }
                      //     alt="sign"
                      //     className="sign-front-preview"
                      //   />
                      // </Grid>
                    )}

                    {/* pan upload */}
                    <Grid container md={12} xs={12}>
                      {authCtx.ifDocsUploaded &&
                      authCtx.ifDocsUploaded.pan_image === 1 ? (
                        <Grid
                          item
                          md={5.6}
                          sx={{
                            mr: { md: 2, sm: 0, xs: 0 },
                            mt: "16px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: "60px", mb: 1 }}
                            color="success"
                          />
                          <Typography sx={{ textAlign: "center" }}>
                            Pan Card Uploaded
                          </Typography>
                        </Grid>
                      ) : (
                        <Grid
                          item
                          md={5.6}
                          sx={{ mr: { md: 2, sm: 0, xs: 0 } }}
                        >
                          <UploadPanModal
                            callbackImage={(image) => {
                              setPanFile(image);
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "poppins",
                              fontSize: "12px",
                              color: "red",
                              fontWeight: "bold",
                              textAlign: "left",
                              mt: 2,
                            }}
                          >
                            {(panV !== false || panV !== true) && panV}
                          </Typography>
                        </Grid>
                      )}

                      {((authCtx.ifDocsUploaded &&
                        authCtx.ifDocsUploaded.pan_image === 1) ||
                        panFile) && (
                        <ShowDocsModal
                          docsImgApi={docsImgApi}
                          panPreview={panPreview}
                          title="Pan"
                        />
                        // old code for docs preview
                        // <Grid
                        //   item
                        //   md={6}
                        //   sx={{
                        //     border: "1px solid #E2E2E4",
                        //     textAlign: "center",
                        //     marginTop: "1.2rem",
                        //     padding: "0.7rem",
                        //     display: "flex",
                        //     flexDirection: "column",
                        //     alignItems: "center",
                        //   }}
                        // >
                        //   <img
                        //     src={
                        //       docsImgApi && docsImgApi.pan_image
                        //         ? docsImgApi.pan_image
                        //         : panPreview
                        //     }
                        //     alt="sign"
                        //     className="sign-front-preview"
                        //   />
                        // </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Box>
                {authCtx.ifDocsUploaded &&
                  (authCtx.ifDocsUploaded.aadhaar_image === 0 ||
                    authCtx.ifDocsUploaded.pan_image === 0) && (
                    <Button
                      variant="contained"
                      type="submit"
                      form={selectedType}
                      sx={{
                        width: "96%",
                        textTransform: "capitalize",
                        mt: 1,
                        backgroundColor: "#231942",
                        "&:hover": {
                          backgroundColor: "#231942",
                        },
                      }}
                      // className="otp-hover-purple"
                      disabled={!panFile || !aadhaarFile}
                    >
                      Update Information
                    </Button>
                  )}
              </Grid>
            )}
            {/* 2fa box */}
            {selectedType === "authentication" && (
              <div className=" position-relative">
                <Spinner loading={progress} />
                <Grid
                  item
                  // hidden={selectedType !== "personal"}
                  className="card-css"
                  sx={{ p: 3, mt: 2, mb: { md: 0, xs: 5 } }}
                >
                  <Box
                    component="form"
                    id={selectedType}
                    validate
                    autoComplete="off"
                    onSubmit={handleforms}
                    sx={{
                      "& .MuiTextField-root": { m: 2 },
                      objectFit: "contain",
                      overflowY: "scroll",
                    }}
                    className="position-relative"
                  >
                    {selectedType === "personal" && (
                      <Spinner loading={progress} />
                    )}

                    <Typography
                      sx={{
                        py: 2,
                        px: 2,
                      }}
                      className="my-profile-topography"
                    >
                      Change Authentication Type Here
                    </Typography>
                    <Grid container sx={{ pt: 1 }}>
                      <Grid item md={12} xs={12} sx={{ mx: 2 }}>
                        <Typography textAlign="justify">
                          2-Factor Authentication (2FA) is an added security
                          layer for logins, requiring two forms of
                          identification. Typically, a password or PIN plus a
                          unique one-time code sent via SMS or email, or a
                          physical security key. This helps prevent unauthorized
                          access to an account, increasing protection against
                          data breaches and identity theft.
                        </Typography>
                      </Grid>
                      <Grid item md={8} xs={12}>
                        <FormControl sx={{ width: "100%", mt: 3, mx: 2 }}>
                          <FormLabel
                            sx={{ textAlign: "left", color: primaryColor() }}
                          >
                            2-Factor Authentication (2FA)
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={radioButton}
                            onChange={(e) => {
                              setradioButton(e.target.value);
                              setopenMPin(true);
                            }}
                          >
                            <FormControlLabel
                              value="OTP"
                              control={
                                <Radio
                                  sx={{
                                    "&.Mui-checked": {
                                      color: primaryColor(),
                                    },
                                  }}
                                />
                              }
                              label="OTP"
                              sx={{ pr: 1 }}
                            />
                            <FormControlLabel
                              value="MPIN"
                              control={
                                <Radio
                                  sx={{
                                    "&.Mui-checked": {
                                      color: primaryColor(),
                                    },
                                  }}
                                />
                              }
                              label="MPin"
                              sx={{ pr: 1 }}
                            />
                            <FormControlLabel
                              value="NONE"
                              control={
                                <Radio
                                  sx={{
                                    "&.Mui-checked": {
                                      color: primaryColor(),
                                    },
                                  }}
                                />
                              }
                              label="Disable"
                              sx={{
                                mx: 0,
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </div>
            )}
            {/* bc certificate */}
            {selectedType === "bc" && envName !== PROJECTS.moneyoddr && (
              <AuthorizationLetters />
            )}
          </Grid>
        </Grid>
      </Grid>
      <CommonMpinModal
        open={openMPin}
        setOpen={setopenMPin}
        hooksetterfunc={setradioButton}
        radioPrevValue={prevRadioState}
        mPinCallBack={(mPinValue) => {
          setMpinCallBackVal(mPinValue);
        }}
      />
    </>
  );
};

export default NewMyProfile;
