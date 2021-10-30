
import React, { useEffect, useReducer, useState } from "react";

import H2 from "../H2";
import ReactDataSheet from "react-datasheet";
import 'react-datasheet/lib/react-datasheet.css';

const tableHeaders = [{ readOnly: true, value: "City", width: 100 }, { readOnly: true, value: 'Id', width: 100 }];
const defaultData = [[{ value: "Seattle" }, { value: 101 }]];

const CityIdTable = ({ getTableData }) => {
    const [tableData, setTableData] = useState([tableHeaders, ...defaultData]);

    const updateTableData = (newData) => {
        // Chop off header before updating parent
        const [, ...justData] = newData
        getTableData?.(justData);
        setTableData(newData);
    }

    useEffect(() => {
        // Chop off header before updating parent
        const [, ...justData] = tableData
        getTableData?.([, ...justData]);
    }, [])
    return <div
        className="column padded elevated rounded bordered flex-start"
        style={{ flexGrow: 1 }}
    >
        <H2 text={"Cities & Ids"}></H2>
        <div className="row flex-wrap">
            <div className="column keymap-list padded flex-start">
                <div className=" white flex-start ">
                    <ReactDataSheet data={tableData} valueRenderer={({ value }) => value}
                        onCellsChanged={(changes, additions) => {
                            const grid = tableData;
                            changes.forEach(({ cell, row, col, value }) => {
                                grid[row][col] = { ...grid[row][col], value };
                            });
                            additions?.forEach(({ row, col, value }) => {
                                if (!grid[row]) {
                                    grid.push([]);
                                }
                                if (!grid[row][col]) {
                                    grid[row].push([])
                                }
                                grid[row][col] = { value }
                            })


                            updateTableData(grid);
                        }}></ReactDataSheet>

                    <button onClick={() => updateTableData([...tableData, [{}, {}]])} >Add Row</button>
                </div>
            </div></div>
    </div>
}

export default CityIdTable;