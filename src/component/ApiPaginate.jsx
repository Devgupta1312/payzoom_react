/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAx } from "../network/ApiController";
import { apiErrorToast } from "../utils/ToastUtil";
import PaginateTable from "./PaginateTable";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/AuthContext";
import useCommonContext from "../store/CommonContext";

const ApiPaginate = ({
  showSearch,
  prefilledQuery,
  user,
  columns = [],
  apiEnd,
  filterFunc,
  ExpandedComponent = [],
  paginateServer = true,
  returnRefetch,
  expandVisible,
  setExpandVisible,
  search,
  queryParam,
  tableStyle,
  apiData,
  setApiData,
  selectableRows,
  onSelectedRowsChange,
  clearSelection,
  selectableRowDisabled = false,
  onRowClicked,
  conditionalRowStyles,
  persistTableHead = true,
  subHeader,
  paginate = true,
  responses,
  per_page,
}) => {
  const [list, setList] = useState(apiData ? apiData : []);
  // const [list, setList] = useState([]);
  const [filteresList, setFilteredList] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(per_page ? per_page : 15);
  const [lastPage, setLastPage] = useState(1);
  // not imp to  paginate functionality but do not delte
  const { pushFlag, setPushFlag } = useCommonContext();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const getUrl = (page, paginate) => {
    return `${apiEnd}?page=${page}&paginate=${paginate}${
      queryParam ? "&" + queryParam : ""
    }${!showSearch && prefilledQuery ? "&" + prefilledQuery : ""}`;
  };
  const [{ data, loading, error }, refetch] = useAx(getUrl(lastPage, perPage));
  if (returnRefetch) {
    returnRefetch(refetch);
  }

  // useEffect(() => {
  //   if (apiData) {
  //     setList(apiData);
  //   } else {
  //     setList([]);
  //   }
  // }, [apiData]);

  useEffect(() => {
    if (data) {
      if (data.results) {
        setUiData(data.results, data.count);
        if (setApiData) setApiData(data.results);
        if (responses) responses(data.count);
      }
      // ------------------------------------------------------
      // CONDITION FOR NEPAL SEARCH TRANSACTIONS DATA .........
      // ------------------------------------------------------
      if (data?.data?.Transactions?.Transaction) {
        if (Array.isArray(data?.data?.Transactions?.Transaction)) {
          setUiData(
            data.data.Transactions.Transaction,
            data.data.Transactions.Transaction.length
          );
        } else {
          setUiData(
            [data.data.Transactions.Transaction],
            data.data.Transactions.Transaction.length
          );
        }

        if (setApiData) {
          if (Array.isArray(data?.data?.Transactions?.Transaction)) {
            setApiData(data.data.Transactions.Transaction.reverse());
          } else {
            setApiData([data.data.Transactions.Transaction]);
          }

          if (responses) responses(data.data.Transactions.Transaction.length);
        }
      } else {
        const myData = data && data.data;

        if (myData && myData.data) {
          setUiData(myData.data, myData.total);
          if (responses) responses(myData.total);
          if (setApiData) setApiData(myData.data);
        } else if (data) {
          // console.log("here");
          if (data?.sum && pushFlag) {
            myData.push(data?.sum);
            setPushFlag(false);
          }
          if (data.data) setUiData(data.data, data.total);
          // if (responses) responses(data.total);
          else setUiData(data);
          if (setApiData) setApiData(myData);
          if (responses) responses(myData.total);
        }
      }
    } else if (data) {
      if (!data.data) console.log("no data");
    }
    return () => {};
  }, [data]);

  useEffect(() => {
    if (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire("Unathorized, you need to Relogin.");

        navigate("/login");
        authCtx.logout();
      }
      if (error.message && error.message === "Network Error") {
        Swal.fire("Check your Network Connection!!!");
      } else {
        apiErrorToast(error, "logged Out! Please login again");
      }
    }
    return () => {};
  }, [error]);

  useEffect(() => {
    refetch();
    return () => {};
  }, [queryParam]);

  useEffect(() => {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (search) {
          const ls = list.filter((item) => {
            return filterFunc && filterFunc(item, search);
          });
          resolve(ls);
        } else {
          resolve(list);
        }
      }, 100);
    })
      .then((ls) => {
        setFilteredList(ls);
      })
      .catch((err) => {
        console.log("error in promise " + err);
      });
    return () => {};
  }, [search, list]);

  const setUiData = (myData, total) => {
    setTotalRows(total);
    setList(myData);
  };
  const handlePageChange = (page) => {
    setLastPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setLastPage(page);
    setPerPage(newPerPage);
  };

  return (
    <div
      style={{
        overflow: "auto",
        borderRadius: "0px",
        width: "100%",
        objectFit: "fill",
        border: "none",
      }}
    >
      <PaginateTable
        columns={columns}
        list={filteresList}
        persistTableHead={persistTableHead}
        setList={setFilteredList}
        tableStyle={tableStyle}
        ExpandedComponent={ExpandedComponent}
        filterFunc={filterFunc}
        progressPending={loading}
        totalRows={totalRows}
        handlePerRowsChange={handlePerRowsChange}
        handlePageChange={handlePageChange}
        expandVisible={expandVisible}
        setExpandVisible={setExpandVisible}
        selectableRows={selectableRows}
        onSelectedRowsChange={onSelectedRowsChange}
        clearSelection={clearSelection}
        conditionalRowStyles={conditionalRowStyles}
        onRowClicked={onRowClicked}
        subHeader={subHeader}
        paginate={paginate}
        paginateServer={paginateServer}
        selectableRowDisabled={selectableRowDisabled}
        per_page={per_page}
      />
    </div>
  );
};

export default ApiPaginate;
