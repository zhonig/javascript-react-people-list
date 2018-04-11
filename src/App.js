import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { makeData, Tips, pageLimit } from "./Utils";
import _ from "lodash";
import ReactTable from "react-table";
import "react-table/react-table.css";

const rawData = makeData();

const requestData = (pageSize, page, sorted, filtered) => {
  return new Promise((resolve, reject) => {
    let filteredData = rawData;

    if (filtered.length) {
      filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
        return filteredSoFar.filter(row => {
          return (row[nextFilter.id] + "").toLowerCase().includes(nextFilter.value.toLowerCase());
        });
      }, filteredData);
    }
    
	const sortedData = _.orderBy(
      filteredData,
      sorted.map(sort => {
        return row => {
          if (row[sort.id] === null || row[sort.id] === undefined) {
            return -Infinity;
          }
          return typeof row[sort.id] === "string"
            ? row[sort.id].toLowerCase()
            : row[sort.id];
        };
      }),
      sorted.map(d => (d.desc ? "desc" : "asc"))
    );

    const res = {
      rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
      pages: Math.ceil(filteredData.length / pageSize)
    };

    setTimeout(() => resolve(res), 500);
  });
};

class App extends Component {
  
  constructor() {
	  super();
	  this.state = {
		data: [],
		pages: null,
		loading: true
	  };
	  this.fetchData = this.fetchData.bind(this);
	  this.renderEditable = this.renderEditable.bind(this);
  }
  
  fetchData(state, instance) {
	this.setState({ loading: true });
	requestData(
		state.pageSize,
		state.page,
		state.sorted,
		state.filtered
	).then(res => {
		this.setState({
			data: res.rows,
			pages: res.pages,
			loading: false
		});
	});
  }
  
  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }
  
  render() {
	const { data, pages, loading } = this.state;
	
	return (
		<div className="App">
			<header className="App-header">
			  <img src={logo} className="App-logo" alt="logo" />
			  <h1 className="App-title">Welcome to People List App</h1>
			</header>
			<ReactTable
				manual
				data={data}
				pages={pages}
				loading={loading}
				onFetchData={this.fetchData}
				filterable
				defaultPageSize={pageLimit}
				style={{
					height: "400px"
			    }}
				className="-striped -highlight"
				noDataText="No Data Found!"
				columns={[
					{
						Header: "Name",
						columns: [
							{
								Header: "First Name",
								accessor: "firstName",
								Cell: this.renderEditable
							},
							{
								Header: "Last Name",
								id: "lastName",
								accessor: d => d.lastName,
								Cell: this.renderEditable
							}
						]
					},
					{
						Header: "Info",
						columns: [
							{
								Header: "Age",
								accessor: "age",
								Cell: this.renderEditable
							},
							{
								Header: "Status",
								accessor: "status",
								Cell: this.renderEditable
							}
						]
					},
					{
						Header: "Stats",
						columns: [
							{
								Header: "Visits",
								accessor: "visits",
								Cell: this.renderEditable
							}
						]
					}
				]}
			/>
			<br />
			<Tips />
		</div>
    );
  }
}

export default App;
