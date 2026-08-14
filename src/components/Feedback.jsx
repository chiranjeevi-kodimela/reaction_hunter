function Feedback({ type, message }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`feedback ${type}`}>
      {message}
    </div>
  );
}

export default Feedback;