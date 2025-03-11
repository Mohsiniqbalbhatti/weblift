import React from "react";
import { FaEdit, FaTimes } from "react-icons/fa";

export default function TeamList() {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Team Members</h5>
          <div className="teamList">
            {" "}
            <table className="table ">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>Admin</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2">
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-danger">
                      <FaTimes />
                    </button>
                  </td>{" "}
                </tr>
                <tr>
                  <th scope="row">1</th>
                  <td>Donne</td>
                  <td>Viewer</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2">
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-danger">
                      <FaTimes />
                    </button>
                  </td>{" "}
                </tr>
                <tr>
                  <th scope="row">1</th>
                  <td>Ali</td>
                  <td>Editor</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2">
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-danger">
                      <FaTimes />
                    </button>
                  </td>{" "}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
