function Loading({ text = "Äang táº£i..." }) {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="spinner-border text-primary mr-4" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="text-gray-500">{text}</span>
    </div>
  );
}

export default Loading;

