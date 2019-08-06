import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    textAlign: "center",
    width: "350px",
    height: "430px",
    overflow: "scroll",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
  }
};

function SignUpModal({
  modalIsOpen,
  closeModal,
  modalMessage,
  newUsername,
  newPassword,
  newName,
  newRole,
  handleChange,
  signupClick
  // onFormSubmit
}) {
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div>
          <span
            className="closeModal"
            onClick={closeModal}
            aria-label="closeModal"
            role="img"
          >
            ❌
          </span>
        </div>
        <h2>Please enter the following information:</h2>
        <form onSubmit={signupClick}>
          <input
            type="text"
            className="sign-up-input"
            id="newName"
            onChange={handleChange}
            value={newName}
            placeholder="Name*"
            required
          />
          <input
            type="text"
            className="sign-up-input"
            id="newUsername"
            onChange={handleChange}
            value={newUsername}
            placeholder="Username*"
            required
          />
          <input
            type="text"
            className="sign-up-input"
            id="newPassword"
            onChange={handleChange}
            value={newPassword}
            placeholder="Password*"
            required
          />
          <section>
            <label htmlFor="Role" className="sign-up-select-label">
              I am a*{" "}
            </label>
            <select
              className="sign-up-select"
              id="newRole"
              name="Role"
              required
              value={newRole}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
          </section>
          <input className="sign-up-button" type="submit" value="Sign me up!" />
        </form>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}

export default SignUpModal;
