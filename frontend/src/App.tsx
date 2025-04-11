import "./styles.css";
import Box from "./components/box";
function App() {
  return (
    <div className="bg-black min-h-screen flex flex-row">
      <div className="w-full">
      <Box id={1} />
      </div>

    </div>
  );
}

export default App;

/*

      <div className="w-full flex-col">
        <div className="w-full h-1/2 flex-auto flex-row">
          <Box id={1} />
          <Box id={2} />
        </div>
      </div>

      <div className="w-full flex-col">
        <div className="w-full h-1/2 flex-auto flex-row">
          <Box id={3} />
          <Box id={4} />
        </div>
      </div>

*/