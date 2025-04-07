import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTimes } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function TeamList(props) {
  const team = props.team;
  const inviteCode = props.inviteCode;
  const adminAccess = props.adminAccess;
  const projectId = props.projectId; // Get projectId from props

  // State to store the team member being edited
  const [editMember, setEditMember] = useState(null);

  // Initialize React Hook Form for the edit role form
  const { register, handleSubmit, reset } = useForm();

  // Update form default value when a new member is selected for editing
  useEffect(() => {
    if (editMember) {
      reset({ newRole: editMember.access });
    }
  }, [editMember, reset]);

  // Frontend function to handle removing a team member
  const handleRemove = async (member) => {
    // Confirm removal with the admin
    if (
      window.confirm(
        `Are you sure you want to remove ${member.name} from you team?`
      )
    ) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}project/deleteTeamMember`,
          {
            projectId: projectId,
            memberId:
              typeof member.userID === "object" && member.userID.$oid
                ? member.userID.$oid
                : member.userID,
          },
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          toast.success(res.data.message);
          window.location.reload();
        }
        // If a refresh function is provided, call it to update the team list
        if (props.refreshTeam) {
          props.refreshTeam();
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error removing team member"
        );
      }
    }
  };

  // Frontend function to handle submitting the edit role form
  const onEditSubmit = async (data) => {
    if (!editMember) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}project/editTeamMemberRole`,
        {
          projectId: projectId,
          memberId:
            typeof editMember.userID === "object" && editMember.userID.$oid
              ? editMember.userID.$oid
              : editMember.userID,
          newRole: data.newRole,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      // If a refresh function is provided, call it to update the team list
      if (props.refreshTeam) {
        props.refreshTeam();
      }
      // Hide the modal manually using Bootstrap's modal instance
      const modalEl = document.getElementById("editRoleModal");
      const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
      // Clear the edit member state
      setEditMember(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating team member role"
      );
    }
  };

  // Function to handle copying the invite code
  const handleCopyclick = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success("Team Code Copied");
  };

  return (
    <div className="container-fluid">
      <div className="card team-card">
        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between pt-0">
            Team Members{" "}
            {adminAccess && (
              <button
                className="btn btn-primary rounded-pill"
                data-bs-toggle="modal"
                data-bs-target="#codeModal"
              >
                Add
              </button>
            )}
          </h5>

          {team && team.length > 0 ? (
            <div className="teamList">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Role</th>
                    {adminAccess && <th scope="col">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {team.map((member, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{member.name}</td>
                      <td>{member.access}</td>
                      {adminAccess && (
                        <td>
                          {/* Edit button now opens a modal for editing role */}
                          <button
                            className="btn btn-sm btn-primary me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#editRoleModal"
                            onClick={() => setEditMember(member)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemove(member)}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">Add Team Members</p>
          )}
        </div>
      </div>

      {/* Invite Modal (existing modal for copying invite code) */}
      <div
        className="modal fade"
        id="codeModal"
        tabIndex="-1"
        aria-labelledby="codeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="codeModal">
                Want to add a new team member?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Just copy this team code and ask them to join!</p>
              <pre
                className="d-flex justify-content-center cursor-pointer"
                title="click to copy"
                onClick={handleCopyclick}
              >
                <code className="codeBlock">{inviteCode}</code>
                <FaCopy className="ms-5" />
              </pre>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New: Edit Role Modal using React Hook Form */}
      <div
        className="modal fade"
        id="editRoleModal"
        tabIndex="-1"
        aria-labelledby="editRoleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editRoleModalLabel">
                Edit Role for {editMember ? editMember.name : ""}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setEditMember(null)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onEditSubmit)}>
                <div className="mb-3">
                  <label htmlFor="newRole" className="form-label">
                    New Role
                  </label>
                  <select
                    id="newRole"
                    className="form-select"
                    {...register("newRole", { required: "Role is required" })}
                  >
                    <option value="visitor">Visitor</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Role
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
