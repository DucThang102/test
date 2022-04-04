import axios from "axios";

export const getFundedProjects = (filter) => {
    return axios.post("http://139.99.62.190:8000/api/v1/fund_projects/filter ", {...filter})
}