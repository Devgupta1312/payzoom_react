export const primaryColor = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return "#f48f26";
  }
};
export const primaryLight = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return "#9f86c0";
  }
};
export const primaryLightest = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return "#f48f26";
  }
};
export const secondaryColor = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return "#3f3f3f";
  }
};

export const getHoverActive = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return "#3f3f3f";
  }
};
export const getHoverInActive = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return "#ffa23f";
  }
};

export const getTableHeadRowColor = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return "#3f3f3f";
  }
};

export const getEnv = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return "PaisaKart";
  }
};
export const blackColor = () => {
  return "#1a1a1a";
};
export const whiteColor = () => {
  return "#f5f5f5";
};

// user icon bg color change functions . . . .
export const getUserColor = (role) => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    if (role === "Asm") {
      return "#9f86c0";
    } else if (role === "Ad") {
      return "#f48f26";
    } else if (role === "Ret") {
      return "#00BF78";
    } else if (role === "Dd") {
      return "#9f86c0";
    } else if (role === "Api") {
      return "#ff9800";
    }
  } else if (process.env.REACT_APP_TITLE === "PaisaKart") {
    if (role === "Asm") {
      return "#f48f26";
    } else if (role === "Ad") {
      return "#3f3f3f";
    } else if (role === "Ret") {
      return "#dc5f5f";
    } else if (role === "Dd") {
      return "#00BF78";
    } else if (role === "Api") {
      return "#ff9800";
    }
  } else if (process.env.REACT_APP_TITLE === "MoneyOddr") {
    if (role === "Asm") {
      return "#f48f26";
    } else if (role === "Ad") {
      return "#3f3f3f";
    } else if (role === "Ret") {
      return "#dc5f5f";
    } else if (role === "Dd") {
      return "#00BF78";
    } else if (role === "Api") {
      return "#ff9800";
    }
  }
};

export const randomColors = () => {
  // Array containing colors
  var colors = [
    "rgb(153, 102, 255 , 0.20)",
    "rgb(75, 192, 192 , 0.20)",
    "rgb(255, 204, 86 , 0.20)",
    "rgb(255, 99, 133 , 0.20)",
    "#d3d3d3",
  ];

  // selecting random color
  var random_color = colors[Math.floor(Math.random() * colors.length)];
  return random_color;
};

export const getStatusColor = (status) => {
  const st = status?.toLowerCase();
  if (st === "total") {
    return "#9f86c0";
  }
  if (st === "success" || st === "paid") {
    return "#00bf78";
  }
  if (st === "pending" || st === "post") {
    return "#FFCC56";
  }
  if (st === "failed") {
    return "#DC5F5F";
  }
  if (st === "refund") {
    return "#9F86C0";
  } else {
    return "#DC5F5F";
  }
};

export const getFirmAddress = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return `Shop No. 33 , CSC-4, Sector-2, Rohini, New Delhi - 110085`;
  }
};
export const getFirmContact = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return `+91-7827270701, 01140507245`;
  }
};
export const getFirmEmail = () => {
  if (process.env.REACT_APP_TITLE === "PaisaKart") {
    return `paisakart2023@gmail.com`;
  }
};

export const getPriorityBg = (priority) => {
  if (priority === "HIGH") {
    return "rgba(211, 47, 47, 0.089)";
  }
  if (priority === "MEDIUM") {
    return "rgb(255, 244, 220)";
  }
  if (priority === "LOW") {
    return "rgb(255 193 7 / 8%)";
  }
};
export const getPriorityColor = (priority) => {
  if (priority === "HIGH") {
    return "rgba(211, 47, 47)";
  }
  if (priority === "MEDIUM") {
    return "rgb(255, 204, 86)";
  }
  if (priority === "LOW") {
    return "rgb(255 193 7)";
  }
};
