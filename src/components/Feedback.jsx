function Feedback({ type, message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`feedback ${type}`}
      style={{
        position: "fixed",
        top: "120px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999999,
        padding: "15px 30px",
        fontSize: "32px",
        fontWeight: "bold",
        backgroundColor: "#222",
        border: "3px solid white",
        borderRadius: "10px",
      }}
    >
      {message}
    </div>
  );
}

export default Feedback;