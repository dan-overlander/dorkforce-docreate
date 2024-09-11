import { sortArrayOfObjects, generateData, make } from "./dodata.js";


// The mockServerAPI simulates a server call that returns an object containing data and totalItems
// In this code, data and totalItems are mocked to show an example of the returned object
// The API will need to be properly set up in order to pass data correctly

const mockServerAPI = ({ currentPage, pageSize, sort, filter }) => {
    const totalItems = 1000;

    return new Promise((resolve) => {
        const data = [];

        for (let i = 0; i < pageSize; i++) {
            data.push({
                columns: [{ value: Math.round(Math.random() * 100000) }, { value: "GSCM" }, { value: "02/16/2023" }, { value: "Success" }],
            });
        }

        setTimeout(() => {
            resolve({ data, totalItems });
        }, 250);
    });
};

const fetchData = async ({ currentPage, pageSize, sort, filter }) => {
    try {
        const response = await mockServerAPI({ currentPage, pageSize, sort });
        return { data: response.data, totalItems: response.totalItems };
    } catch (error) {
        console.warn("fetchData fail", error);
    }
};

// const columns = [{ value: "Ticket ID" }, { value: "Team" }, { value: "Date" }, { value: "Status" }];

// const element = document.getElementById("table-559459393");
// DDS.Table(element, {
//     dataSource: { fetchData },
//     columns,
//     subscribe: ["table-559459393-pagination"],
//     pagination: { currentPage: 1, rowsPerPage: 4 },
// });

// const paginationElement = document.getElementById("table-559459393-pagination");
// DDS.Pagination(paginationElement, {
//     subscribe: ["table-559459393"],
// });

const data = [
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
    { columns: [{ value: make.number(1, 1000) }, { value: make.name().first }], expandable: true, expandableContent: make.quote() },
];

const manualTrigger = DCR.add({
    method: `button`,
    options: {
        class: `dds__button--sm ddsc__button--bot`,
        id: `doMsgTrigger`,
        label: DCR.icon({
            icon: `clipboard-notes`,
            type: `font`,
        }).outerHTML,
    },
});
const myDrawer2 = DCR.add({
    method: `drawer`,
    options: {
        id: `myDrawer2`,
        trigger: manualTrigger,
        labels: {
            title: `The Stanchurian Candidate`,
        },
        body: DCR.element(`<div id="drawerBody"></div>`),
    }
});
const myTable = DCR.add({
    method: `table`,
    target: `#drawerBody`,
    options: {
        id: `idTable`,
        subscribe: ["idPagination"],
        pagination: { 
            currentPage: 2,
            rowsPerPage: 8,
        },
    },
    ddsOptions: {
        expandableRows: true,
        data,
        columns: [{ value: "Ticket ID" }, { value: "Team" }],
        
    }
});
const myPagination = DCR.add({
    method: `pagination`,
    target: `#drawerBody`,
    options: {
        id: `idPagination`,
        perPageValues: [4, 8, 12],
        currentPage: 2,
        rowsPerPage: 8,
    },
    ddsOptions: { 
        subscribe: ["idTable"],
    }
});