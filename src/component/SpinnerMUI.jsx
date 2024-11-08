import { CircularProgress } from "@mui/material";
import React from "react";

const SpinnerMUI = ({ loading = false, params = false, size = 20 }) => {
  return (
    <React.Fragment>
      {loading ? <CircularProgress color="inherit" size={size} /> : null}
      {params && params.InputProps.endAdornment}
    </React.Fragment>
  );
};

export default SpinnerMUI;
